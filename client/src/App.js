import React, { Component } from 'react'
import createHistory from 'history/createBrowserHistory'
import { connect, Provider } from 'react-redux'
import AppRouter from './routers/AppRouter'
import configureStore from './store/configureStore'
import { ApolloProvider } from "react-apollo"
import getClient from './utils/apollo'
import auth from './utils/auth'
import { setAuthCompleted } from './actions/auth'

// Setup Redux and Apollo Client
const store = configureStore()
const client = getClient(store)

// Create and export history
export const history = createHistory()

// Set up Auth service and put it on state so it's globally available
const checkAuth = async () => {
  console.log('Checking auth...')
  const state = store.getState()
  const dispatch = store.dispatch
  if (localStorage.getItem('isLoggedIn') === 'true') {
    try {
      await auth().renewSession(state, dispatch, client)
      console.log('Auth session renewed')
    } catch (err) {
      console.log('Failed to renew session - logged out')
    }
  } else {
    // If not currently logged in, mark auth complete
    dispatch(setAuthCompleted(true))
  }
}
checkAuth()

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ApolloProvider client={client}>
          <AppRouter auth={auth} client={client} />
        </ApolloProvider>
      </Provider>
    )
  }
}


export default App