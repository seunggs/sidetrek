import { LOGIN, LOGOUT } from './types'

export const login = (uid) => ({
  type: LOGIN,
  uid
})

export const startLogin = () => {
  return () => {
    return
  }
}

export const logout = () => ({
  type: LOGOUT
})

export const startLogout = () => {
  return () => {
    return
  }
}
