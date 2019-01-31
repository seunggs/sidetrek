import { SET_AUTH, CLEAR_TOKEN_RENEWAL_TIMEOUT } from './types'
import webAuth from '../utils/auth0'
import { setAuthHeader } from '../utils/auth'

export const setAuth = ({ isAuthenticated, expiresAt, idToken, accessToken }) => ({
  type: SET_AUTH,
  isAuthenticated,
  expiresAt,
  idToken,
  accessToken,
})

export const clearTokenRenewalTimeout = (tokenRenewalTimeoutHandler) => ({
  type: CLEAR_TOKEN_RENEWAL_TIMEOUT,
  tokenRenewalTimeoutHandler,
})

export const startLogin = (email, password) => dispatch => {
  return new Promise((resolve, reject) => {
    webAuth.login({
      realm: 'Username-Password-Authentication',
      email,
      password,
    }, (err, result) => {
      console.log('CB for startLogin getting called')
      if (err) { reject(err) }
      resolve(result)
    })
  })
}

export const startSignup = (email, password, user_metadata) => dispatch => {
  return new Promise((resolve, reject) => {
    webAuth.signup({
      connection: 'Username-Password-Authentication',
      email,
      password,
      user_metadata,
    }, (err, result) => {
      if (err) { reject(err) }
      resolve(result)
    })
  })
}

export const startLogout = (history, apolloClient) => (dispatch, getState) => {
  console.log('Logging out...')

  dispatch(setAuth({ isAuthenticated: false, expiresAt: 0, idToken: null, accessToken: null }))

  // Remove Authorization header in future Axios calls
  setAuthHeader()

  // Remove isLoggedIn flag from localStorage
  localStorage.removeItem('isLoggedIn')

  // Clear the token renewal timeout
  console.log('Clearing token renewal timeout...')
  clearTimeout(getState().auth.tokenRenewalTimeoutHandler)

  // Clear Apollo cache
  apolloClient.resetStore()

  history.replace('/')
}
