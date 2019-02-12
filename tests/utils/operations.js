import { gql } from 'apollo-boost'

const createUser = gql`
    mutation($data: UserCreateInput!) {
        createUser(
            data: $data
        ){
            token,
            user {
                id
                name
                email
            }
        }
    }
`

const getUsers = gql`
    query {
        users {
            id
            name
            email
        }
    }
`
export { createUser, getUsers }