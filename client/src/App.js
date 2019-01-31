import React, { Component } from 'react'
import createHistory from 'history/createBrowserHistory'
import { Provider } from 'react-redux'
import AppRouter from './routers/AppRouter'
import configureStore from './store/configureStore'
import { ApolloProvider } from "react-apollo"
import getClient from './utils/apollo'
import auth from './utils/auth'

// Setup Redux and Apollo Client
const store = configureStore()
const client = getClient(store)

// Create and export history
export const history = createHistory()

// Set up Auth service and put it on state so it's globally available
const checkAuth = async () => {
  console.log('Checking auth...')
  if (localStorage.getItem('isLoggedIn') === 'true') {
    try {
      await auth().renewSession(store)
      console.log(store.getState().auth)
      console.log('Auth session renewed')
    } catch (err) {
      console.log('Failed to renew session - logged out')
    }
  }
}
checkAuth()

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ApolloProvider client={client}>
          <AppRouter auth={auth} store={store} />
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
//     console.log("Client request: ", {
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