import webAuth from './auth0'
import { history } from '../App'
import axios from 'axios'
import * as R from 'ramda'
import * as moment from 'moment'
import { setAuth, setAuthCompleted, startLogout, clearTokenRenewalTimeout } from '../actions/auth'
import { setUser } from '../actions/user'
import { APP_URL } from './constants'
import { GET_ME_OP, CREATE_USER_OP, UPDATE_USER_OP } from '../operations/user'

export const setAuthHeader = accessToken => {
  if (accessToken) {
    axios.defaults.headers.common['Authorization'] = accessToken
  } else {
    delete axios.defaults.headers.common['Authorization']
  }
}

const auth = () => {
  function checkTokenExpiry(expiresAt) {
    // Check whether the current time is past the token expiry time
    return moment().unix() < expiresAt
  }
  function handleUserInfo(state, dispatch, client, authResult) {
    // First check Redux state
    const { user } = state
    if (user.email) { return Promise.resolve(user) } // do nothing

    const { accessToken } = authResult

    return new Promise((resolve, reject) => {
      webAuth.client.userInfo(accessToken, async (err, userProfile) => {
        if (err) { return reject(err) }

        const { sub, name: fullname, picture } = userProfile
        const signupSrc = R.compose(R.head, R.split('|'))(sub)
        const isEmailPasswordSignup = signupSrc === 'auth0' // as opposed to social login
        const name = isEmailPasswordSignup ? userProfile[`${APP_URL}/name`] : fullname
        const email = userProfile[`${APP_URL}/email`]

        // If not in Redux state, query User DB to see if the user exists in DB
        try {
          const userData = await client.query({
            query: GET_ME_OP
          })
          const user = userData.data.me

          // If it's in DB, first check hasPassword - update DB if this is email-password signup and hasPassword is false
          // Update DB if this is social login and hasSocialLogin is false
          // console.log('isEmailPasswordSignup', isEmailPasswordSignup)
          if (isEmailPasswordSignup && !user.hasPassword) {
            try {
              const userData = await client.mutate({
                variables: {
                  where: { email },
                  data: {
                    hasPassword: true,
                  }
                },
                mutation: UPDATE_USER_OP
              })
              console.log('Updated hasPassword: ', userData.data.updateUser)
            } catch (err) {
              console.log('Failed to update hasPassword')
            }
          } else if (!isEmailPasswordSignup && !user.hasSocialLogin) {
            try {
              const userData = await client.mutate({
                variables: {
                  where: { email },
                  data: {
                    hasSocialLogin: true,
                  }
                },
                mutation: UPDATE_USER_OP
              })
              console.log('Updated hasSocialLogin: ', userData.data.updateUser)
            } catch (err) {
              console.log('Failed to update hasSocialLogin')
            }
          }

          // Set it in Redux state and exit
          dispatch(setUser(user))
          return resolve(user)
        } catch (err) {
          console.log('User not in DB')
          console.log(err)
        }

        // If not in DB, create the user in DB and set it in Redux state
        try {
          console.log('Adding user to User DB...')
          const userData = await client.mutate({
            variables: {
              data: {
                email,
                hasPassword: isEmailPasswordSignup,
                hasSocialLogin: !isEmailPasswordSignup,
                name,
                picture,
                role: 'USER',
              }
            },
            mutation: CREATE_USER_OP
          })

          // Set it in Redux state and exit
          const user = userData.data.createUser
          dispatch(setUser(user))
          return resolve(user)
        } catch (err) {
          console.log('Something went wrong while mutating User DB')
          console.log(err)
          reject(err)
        }
      })
    })
  }
  async function setSession(state, dispatch, client, authResult) {
    console.log('Setting auth session...')
    const { idToken, accessToken, expiresIn } = authResult

    // Set isLoggedIn flag in localStorage
    localStorage.setItem('isLoggedIn', 'true')

    // Set the time that the access token will expire at
    const expiresAt = moment().unix() + expiresIn

    // Set state
    dispatch(setAuth({ isAuthenticated: true, expiresAt, idToken, accessToken }))

    // Schedule token renewal
    scheduleRenewal(state, dispatch, client, authResult)

    // Set the header for all future calls
    setAuthHeader(accessToken)

    // Reset Apollo client store to trigger refetching of queries
    await client.resetStore()

    // Mark setAuthCompleted in Redux state so the Route can be mounted
    // NOTE: must fire after client.resetStore AND before the username redirect
    dispatch(setAuthCompleted(true))

    // Get user info from Auth0 and set it in state (if it doesn't exist already)
    try {
      const userInfo = await handleUserInfo(state, dispatch, client, authResult)

      // If username doesn't exist, send to /username
      if (R.isNil(userInfo.username)) {
        console.log('Username doesn\'t exist: redirecting...')
        history.replace('/username')
        return
      }
    } catch (err) {
      console.log(err)
    }

    // navigate to the home route if in /callback but stay otherwise
    if (history.location.pathname === '/callback') {
      history.replace('/')
    }
  }
  function handleAuth(state, dispatch, client) {
    // Prevents handleAuth being called multiple times due to state update during setSession
    // If it's called mulptile times, Auth0 will throw the 'state does not match' error
    if (localStorage.getItem('isLoggedIn') === 'true') { return }

    webAuth.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        // Set session
        setSession(state, dispatch, client, authResult)
      } else if (err) {
        console.log('handleAuth error:')
        console.log(err)
        dispatch(setAuthCompleted(true))
        history.replace('/')
      }

    })
  }
  function renewSession(state, dispatch, client) {
    webAuth.checkSession({}, (err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        setSession(state, dispatch, client, authResult)
      } else if (err) {
        console.log('renewSession error:')
        console.log(err)
        dispatch(startLogout(history, client))
        dispatch(setAuthCompleted(true))
      }
    })
  }
  function scheduleRenewal(state, dispatch, client, authResult) {
    const timeout = authResult.expiresIn * 1000
    if (timeout > 0) {
      const tokenRenewalTimeoutHandler = setTimeout(() => {
        console.log('Renewing session from scheduled token renewal...')
        renewSession(state, dispatch, client)
      }, timeout)

      // Save tokenRenewalTimeoutHandler to be called on log out
      dispatch(clearTokenRenewalTimeout(tokenRenewalTimeoutHandler))
    }
  }
  return {
    checkTokenExpiry,
    handleAuth,
    renewSession,
  }
}

export { auth as default }