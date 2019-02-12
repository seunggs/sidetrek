import '@babel/polyfill/noConflict'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
import { ApolloLink, Observable } from 'apollo-link'
import { WebSocketLink } from "apollo-link-ws"
import { getMainDefinition } from 'apollo-utilities'
import { createUploadLink } from 'apollo-upload-client'
import { PRISMA_HTTP_URL, PRISMA_WS_URL } from './constants'
import logger from './logger'

// console.log('REACT_APP_PRISMA_SERVER_HOST', process.env.REACT_APP_PRISMA_SERVER_HOST)
const httpURL = PRISMA_HTTP_URL
const websocketURL = PRISMA_WS_URL

// To determine if the request is a file upload
const isFile = value => (
  (typeof File !== 'undefined' && value instanceof File) ||
  (typeof Blob !== 'undefined' && value instanceof Blob)
)
const isUpload = ({ variables }) => Object.values(variables).some(isFile)

// To determine if the request is a subscription
const isSubscriptionOperation = ({ query }) => {
  const { kind, operation } = getMainDefinition(query);
  return kind === 'OperationDefinition' && operation === 'subscription';
}

// Error handling
const onGraphQLError = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    )
  }

  if (networkError) {
    console.log(`[Network error]: ${networkError}`)
  }
})

const getClient = (store) => {
  // Setup the authorization header for the http client
  const request = async (operation) => {
    const { accessToken } = store.getState().auth
    // console.log('accessToken in get apollo client requestLink', accessToken)
    if (accessToken) {
      operation.setContext({
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
    }
  }

  // Setup the request handlers for the http clients
  const requestLink = new ApolloLink((operation, forward) => {
    return new Observable((observer) => {
      let handle
      Promise.resolve(operation)
        .then((oper) => {
          request(oper)
        })
        .then(() => {
          handle = forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer),
          })
        })
        .catch(observer.error.bind(observer))

      return () => {
        if (handle) {
          handle.unsubscribe()
        }
      }
    })
  })

  // Web socket link for subscriptions
  const wsLink = ApolloLink.from([
    onGraphQLError,
    requestLink,
    new WebSocketLink({
      uri: websocketURL,
      options: {
        reconnect: true,
        connectionParams: () => {
          const { accessToken } = store.getState().auth
          // console.log('accessToken in get apollo client wsLink', accessToken)      
          if (accessToken) {
            return {
              Authorization: `Bearer ${accessToken}`,
            }
          }
        }
      }
    })
  ])

  // HTTP link for queries and mutations
  const httpLink = ApolloLink.from([
    onGraphQLError,
    requestLink,
    new HttpLink({
      uri: httpURL,
      credentials: 'same-origin'
    }),
  ])

  // Link to direct ws and http traffic to the correct place
  const link = ApolloLink.split(
    // Pick which links get the data based on the operation kind
    isSubscriptionOperation,
    wsLink,
    httpLink,
  )

  const uploadLink = ApolloLink.from([
    onGraphQLError,
    requestLink,
    createUploadLink({ uri: httpURL }),
  ])

  // Pick final link based on whether the request is a file upload or not
  const terminalLink = ApolloLink.split(isUpload, uploadLink, link)

  return new ApolloClient({
    link: terminalLink,
    cache: new InMemoryCache()
  })
}

export { getClient as default }