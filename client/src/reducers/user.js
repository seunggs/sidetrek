import * as R from 'ramda'
import {
  SET_USER,
  RESET_USER,
  UPDATE_USER,
} from '../actions/types'

const initialState = {
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        ...R.omit(['type'], action)
      }
    case RESET_USER:
      return {
        ...state,
        ...R.mapObjIndexed(val => null)(state)
      }
    case UPDATE_USER:
      return {
        ...state,
        ...R.omit(['type'], action)
      }
    default:
      return state
  }
}