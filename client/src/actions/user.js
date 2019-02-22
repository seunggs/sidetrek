import {
  SET_USER,
  RESET_USER,
  UPDATE_USER,
} from './types'
import {
  UPDATE_USER_OP,
  DELETE_USER_OP,
} from '../operations/user'

export const setUser = (user) => ({
  type: SET_USER,
  ...user
})

export const resetUser = () => ({
  type: RESET_USER,
})

export const updateUser = updates => ({
  type: UPDATE_USER,
  ...updates
})

export const startUpdateUser = (client, email, updates) => async (dispatch) => {
  // Update DB
  const updatedUser = await client.mutate({
    variables: { where: { email }, data: updates },
    mutation: UPDATE_USER_OP
  })

  // Update Redux state
  dispatch(updateUser(updates))

  return updatedUser
}

export const startDeleteUser = (client, email) => async (dispatch) => {
  // Update DB
  const deletedUser = await client.mutate({
    variables: { where: { email } },
    mutation: DELETE_USER_OP
  })

  // Update Redux state
  dispatch(resetUser())

  return deletedUser
}