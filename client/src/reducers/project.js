import * as R from 'ramda'
import {
  SET_PROJECTS,
  CREATE_PROJECT,
  UPDATE_PROJECT,
  DELETE_PROJECT,
} from '../actions/types'

const initialState = []

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_PROJECTS:
      return action.projects
    case CREATE_PROJECT:
      return [
        ...state,
        action.project
      ]
    case UPDATE_PROJECT:
      return R.compose(
        R.append(action.project),
        R.reject(({ id }) => id === action.project.id),
      )(state)
    case DELETE_PROJECT:
      return R.reject(({ id }) => id === action.project.id)(state)
    default:
      return state
  }
}