import gql from 'graphql-tag'

/**
 * NOTE: Include 'id' in all queries and mutations so Apollo can match them for automatic cache update
 */

const commentOps = {
  fragments: {
    commentInfo: gql`
      fragment commentInfo on Comment {
        id
        createdAt
        updatedAt
        author {
          id
          username
        }
        reactions {
          id
          author {
            id
            username
          }
          emoji
        }
        body
        post {
          id
        }
        parentComment {
          id
        }
        childComments {
          id
        }
      }
    `
  }
}

export const GET_COMMENT_OP = gql`
  query Comment($where: CommentWhereUniqueInput!) {
    comment(where: $where) {
      ...commentInfo
    }
  }
  ${commentOps.fragments.commentInfo}
`

export const GET_COMMENTS_OP = gql`
  query Comments($where: CommentWhereInput) {
    comments(where: $where) {
      ...commentInfo
    }
  }
  ${commentOps.fragments.commentInfo}
`

export const CREATE_COMMENT_OP = gql`
  mutation CreateComment($data: CommentCreateInput!) {
    createComment(data: $data) {
      ...commentInfo
    }
  }
  ${commentOps.fragments.commentInfo}
`

export const UPDATE_COMMENT_OP = gql`
  mutation UpdateComment($where: CommentWhereUniqueInput!, $data: CommentUpdateInput!) {
    updateComment(where: $where, data: $data) {
      ...commentInfo
    }
  }
  ${commentOps.fragments.commentInfo}
`

export const DELETE_COMMENT_OP = gql`
  mutation DeleteComment($where: CommentWhereUniqueInput!) {
    deleteComment(where: $where) {
      ...commentInfo
    }
  }
  ${commentOps.fragments.commentInfo}
`