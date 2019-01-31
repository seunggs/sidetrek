import webAuth from './auth0'
import { history } from '../App'
import axios from 'axios'
import * as moment from 'moment'
import { setAuth, startLogout, clearTokenRenewalTimeout } from '../actions/auth'

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
  function setSession(store, authResult) {
    console.log('Setting auth session...')
    const { idToken, accessToken, expiresIn } = authResult

    // Set isLoggedIn flag in localStorage
    localStorage.setItem('isLoggedIn', 'true')

    // Set the time that the access token will expire at
    const expiresAt = moment().unix() + expiresIn

    // Set state
    store.dispatch(setAuth({ isAuthenticated: true, expiresAt, idToken, accessToken }))

    // Schedule token renewal
    scheduleRenewal(store, authResult)

    // Save the profile in the DB and Redux store
    webAuth.client.userInfo(accessToken, (err, user) => {
      
    })

    // Set the header for all future calls
    setAuthHeader(accessToken)

    // navigate to the home route
    history.replace('/')
  }
  function handleAuth(store) {
    webAuth.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {        
        // Set session
        setSession(store, authResult)
      } else if (err) {
        console.log('handleAuth error:')
        console.log(err)
        history.replace('/')
      }
    })
  }
  function renewSession(store) {
    webAuth.checkSession({}, (err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        setSession(store, authResult)
      } else if (err) {
        console.log('renewSession error:')
        console.log(err)
        store.dispatch(startLogout(history))
      }
    })
  }
  function scheduleRenewal(store, authResult) {
    const timeout = authResult.expiresIn * 1000
    if (timeout > 0) {
      const tokenRenewalTimeoutHandler = setTimeout(() => {
        console.log('Renewing session from scheduled token renewal...')
        renewSession(store)
      }, timeout)

      // Save tokenRenewalTimeoutHandler to be called on log out
      store.dispatch(clearTokenRenewalTimeout(tokenRenewalTimeoutHandler))
    }
  }
  return {
    checkTokenExpiry,
    handleAuth,
    renewSession,
  }
}

export { auth as default }