import { SET_AUTH, CLEAR_TOKEN_RENEWAL_TIMEOUT, SET_AUTH_COMPLETED } from './types'
import webAuth from '../utils/auth0'
import { setAuthHeader } from '../utils/auth'
import { resetUser } from './user'

export const setAuthCompleted = (authComplete) => ({
  type: SET_AUTH_COMPLETED,
  authComplete,
})

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

export const startLogout = (history, client) => (dispatch, getState) => {
  console.log('Logging out...')

  // Clear auth and user state
  dispatch(setAuth({ isAuthenticated: false, expiresAt: 0, idToken: null, accessToken: null }))
  dispatch(resetUser())

  // Remove Authorization header in future Axios calls
  setAuthHeader()

  // Remove isLoggedIn flag from localStorage
  localStorage.removeItem('isLoggedIn')

  // Clear the token renewal timeout
  console.log('Clearing token renewal timeout...')
  clearTimeout(getState().auth.tokenRenewalTimeoutHandler)
  dispatch(setAuth({ tokenRenewalTimeoutHandler: null }))

  // Clear Apollo cache
  client.resetStore()

  history.replace('/')
}
