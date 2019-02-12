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
  logger('Checking auth...')
  if (localStorage.getItem('isLoggedIn') === 'true') {
    try {
      await auth().renewSession(store, client)
      logger('Auth session renewed')
    } catch (err) {
      logger('Failed to renew session - logged out')
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

// return new ApolloClient({
//   cache,
//   uri: Api.GRAPH_QL_URL,
//   clientState: { defaults, resolvers },
//   request: async operation => {
//     logger("Client request: ", {
//       operationName: operation.operationName,
//       variables: operation.variables,
//       query: operation.query
//     });
//     let token = await AsyncStorage.getItem(strings.keyToken);
//     operation.setContext({
//       headers: {
//         Accept: "application/json",
//         authorization: token ? JWT ${ token } : ""
//   }
// });
//   }
//   })