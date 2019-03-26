import {
  // GET_SUBSCRIBERS_OP,
  CREATE_SUBSCRIBER_OP,
  UPDATE_SUBSCRIBER_OP,
  DELETE_SUBSCRIBER_OP,
} from '../operations/subscriber'

// export const setSubscribers = subscribers => ({
//   type: SET_SUBSCRIBERS,
//   subscribers
// })

// export const createSubscriber = subscriber => ({
//   type: CREATE_SUBSCRIBER,
//   subscriber
// })

// export const updateSubscriber = subscriber => ({
//   type: UPDATE_SUBSCRIBER,
//   subscriber
// })

// export const deleteSubscriber = subscriber => ({
//   type: DELETE_SUBSCRIBER,
//   subscriber
// })

// export const startSetSubscribers = client => dispatch => {
//   return client.query({
//     query: GET_SUBSCRIBERS_OP
//   })
//     .then(subscribersData => {
//       const { subscribers } = subscribersData.data

//       // Update Redux state
//       dispatch(setSubscribers(subscribers))

//       return subscribers
//     })
// }

export const startCreateSubscriber = (client, subscriber) => async (dispatch) => {
  const createdSubscriber = await client.mutate({
    mutation: CREATE_SUBSCRIBER_OP,
    variables: { data: subscriber },
  })

  return createdSubscriber
}

export const startUpdateSubscriber = (client, email, updates) => async (dispatch) => {
  const updatedSubscriber = await client.mutate({
    mutation: UPDATE_SUBSCRIBER_OP,
    variables: {
      where: { email },
      data: updates
    },
  })

  return updatedSubscriber
}

export const startDeleteSubscriber = (client, email) => async (dispatch) => {
  const deletedSubscriber = await client.mutate({
    mutation: DELETE_SUBSCRIBER_OP,
    variables: {
      where: { email }
    },
  })

  return deletedSubscriber
}