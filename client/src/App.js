import React, { Component } from 'react'
import './App.css'
import { Provider } from 'react-redux';
import AppRouter from './routers/AppRouter';
import configureStore from './store/configureStore';
import { ApolloProvider } from "react-apollo"
import getClient from './utils/apollo'

const store = configureStore()
const client = getClient()

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ApolloProvider client={client}>
          <AppRouter />
        </ApolloProvider>
      </Provider>
    )
  }
}

export default App
