import gql from 'graphql-tag'

/**
 * NOTE: Include 'id' in all queries and mutations so Apollo can match them for automatic cache update
 */

const postOps = {
  fragments: {
    postInfo: gql`
      fragment postInfo on Post {
        id
        createdAt
        updatedAt
        title
        body
        published
        author {
          id
          username
        }
        comments {
          id
          body
          author {
            id
            username
          }
        }
        voters {
          id
          username
        }
        project {
          id
        }
      }
    `
  }
}

export const GET_POST_OP = gql`
  query Post($where: PostWhereUniqueInput!) {
    post(where: $where) {
      ...postInfo
    }
  }
  ${postOps.fragments.postInfo}
`

export const GET_POSTS_OP = gql`
  query Posts($where: PostWhereInput) {
    posts(where: $where) {
      ...postInfo
    }
  }
  ${postOps.fragments.postInfo}
`

export const CREATE_POST_OP = gql`
  mutation CreatePost($data: PostCreateInput!) {
    createPost(data: $data) {
      ...postInfo
    }
  }
  ${postOps.fragments.postInfo}
`

export const UPDATE_POST_OP = gql`
  mutation UpdatePost($where: PostWhereUniqueInput!, $data: PostUpdateInput!) {
    updatePost(where: $where, data: $data) {
      ...postInfo
    }
  }
  ${postOps.fragments.postInfo}
`

export const DELETE_POST_OP = gql`
  mutation DeletePost($where: PostWhereUniqueInput!) {
    deletePost(where: $where) {
      ...postInfo
    }
  }
  ${postOps.fragments.postInfo}
`