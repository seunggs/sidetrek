import gql from 'graphql-tag'

/**
 * NOTE: Include 'id' in all queries and mutations so Apollo can match them for automatic cache update
 */

export const userOps = {
  fragments: {
    userInfo: gql`
      fragment UserInfo on User {
        id
        updatedAt
        createdAt
        email
        hasPassword
        hasSocialLogin
        name
        username
        picture
        role
        members {
          id
          role
        }
        projects {
          id
        }
        votedProjects {
          id
        }
        favoriteProjects {
          id
        }
        posts {
          id
        }
        votedPosts {
          id
        }
        comments {
          id
        }
        reactions {
          id
          comment {
            id
          }
          milestone {
            id
          }
        }
        milestones {
          id
        }
      }
    `
  }
}

export const GET_ME_OP = gql`
  query {
    me {
      ...UserInfo
    }
  }
  ${userOps.fragments.userInfo}
`

export const GET_USER_OP = gql`
  query User($where: UserWhereUniqueInput!) {
    user(where: $where) {
      ...UserInfo
    }
  }
  ${userOps.fragments.userInfo}
`

export const GET_USERS_OP = gql`
  query Users($where: UserWhereInput) {
    users(where: $where) {
      ...UserInfo
    }
  }
  ${userOps.fragments.userInfo}
`

export const CREATE_USER_OP = gql`
  mutation CreateUser($data: UserCreateInput!) {
    createUser(data: $data) {
      ...UserInfo
    }
  }
  ${userOps.fragments.userInfo}
`

export const UPDATE_USER_OP = gql`
  mutation UpdateUser($where: UserWhereUniqueInput!, $data: UserUpdateInput!) {
    updateUser(where: $where, data: $data) {
      ...UserInfo
    }
  }
  ${userOps.fragments.userInfo}
`

export const DELETE_USER_OP = gql`
  mutation DeleteUser($where: UserWhereUniqueInput!) {
    deleteUser(where: $where) {
      ...UserInfo
    }
  }
  ${userOps.fragments.userInfo}
`