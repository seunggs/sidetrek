import {
  SET_AUTH,
  CLEAR_TOKEN_RENEWAL_TIMEOUT,
} from '../actions/types'

const initialState = {
  isAuthenticated: false,
  expiresAt: 0,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_AUTH:
      return {
        ...state,
        isAuthenticated: action.isAuthenticated,
        expiresAt: action.expiresAt,
        idToken: action.idToken,
        accessToken: action.accessToken,
      }
    case CLEAR_TOKEN_RENEWAL_TIMEOUT:
      return {
        ...state,
        tokenRenewalTimeoutHandler: action.tokenRenewalTimeoutHandler
      }
    // case UPDATE_USER_PROFILE:
    //   return {
    //     ...state,
    //     authUser: action.updates
    //   }
    default:
      return state
  }
}