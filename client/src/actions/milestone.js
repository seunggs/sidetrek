import {
  SET_MILESTONES,
  CREATE_MILESTONE,
  UPDATE_MILESTONE,
  DELETE_MILESTONE,
} from './types'
import {
  GET_MILESTONES_OP,
  CREATE_MILESTONE_OP,
  UPDATE_MILESTONE_OP,
  DELETE_MILESTONE_OP,
} from '../operations/milestone'

export const setMilestones = milestones => ({
  type: SET_MILESTONES,
  milestones
})

export const createMilestone = milestone => ({
  type: CREATE_MILESTONE,
  milestone
})

export const updateMilestone = milestone => ({
  type: UPDATE_MILESTONE,
  milestone
})

export const deleteMilestone = milestone => ({
  type: DELETE_MILESTONE,
  milestone
})

export const startSetMilestones = client => dispatch => {
  return client.query({
    query: GET_MILESTONES_OP
  })
    .then(milestonesData => {
      const { milestones } = milestonesData.data

      // Update Redux state
      dispatch(setMilestones(milestones))

      return milestones
    })
}

export const startCreateMilestone = (client, milestone) => async (dispatch) => {
  const createdMilestone = await client.mutate({
    mutation: CREATE_MILESTONE_OP,
    variables: { data: milestone },
  })

  dispatch(createMilestone(createdMilestone.data.createMilestone))

  return createdMilestone
}

export const startUpdateMilestone = (client, milestoneId, updates) => async (dispatch) => {
  const updatedMilestone = await client.mutate({
    mutation: UPDATE_MILESTONE_OP,
    variables: {
      where: { id: milestoneId },
      data: updates
    },
  })

  dispatch(updateMilestone(updatedMilestone.data.updateMilestone))

  return updatedMilestone
}

export const startDeleteMilestone = (client, milestoneId) => async (dispatch) => {
  const deletedMilestone = await client.mutate({
    mutation: DELETE_MILESTONE_OP,
    variables: {
      where: { id: milestoneId }
    },
  })

  dispatch(deleteMilestone(deletedMilestone.data.deleteMilestone))

  return deletedMilestone
}