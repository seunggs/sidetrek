import ApolloBoost from 'apollo-boost'

const getClient = (jwt) => {
    return new ApolloBoost({
        uri: 'http://127.0.0.1:4000',
        request(operation) {
            if (jwt) {
                operation.setContext({
                    headers: {
                        Authorization: `Bearer ${jwt}`
                    }
                })
            }
        }
    })
}

export { getClient as default }