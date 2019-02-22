import React, { Component } from 'react'
import createHistory from 'history/createBrowserHistory'
import { Provider } from 'react-redux'
import AppRouter from './routers/AppRouter'
import configureStore from './store/configureStore'
import { ApolloProvider } from "react-apollo"
import getClient from './utils/apollo'
import auth from './utils/auth'
import { setAuthCompleted } from './actions/auth';
import logger from './utils/logger';

// Setup Redux and Apollo Client
const store = configureStore()
const client = getClient(store)

// Create and export history
export const history = createHistory()

// Set up Auth service and put it on state so it's globally available
const checkAuth = async () => {
  logger.info('Checking auth...')
  if (localStorage.getItem('isLoggedIn') === 'true') {
    try {
      await auth().renewSession(store, client)
      logger.info('Auth session renewed')
    } catch (err) {
      logger.error('Failed to renew session - logged out')
    }
  } else {
    // If not currently logged in, mark auth complete
    store.dispatch(setAuthCompleted(true))
  }
}
checkAuth()

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ApolloProvider client={client}>
          <AppRouter auth={auth} store={store} client={client} />
        </ApolloProvider>
      </Provider>
    )
  }
}

export default App