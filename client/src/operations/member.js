import gql from 'graphql-tag'

/**
 * NOTE: Include 'id' in all queries and mutations so Apollo can match them for automatic cache update
 */

const memberOps = {
  fragments: {
    memberInfo: gql`
      fragment memberInfo on Member {
        id
        createdAt
        updatedAt
        user
        project
      }
    `
  }
}

export const GET_MEMBER_OP = gql`
  query Member($where: MemberWhereUniqueInput!) {
    member(where: $where) {
      ...memberInfo
    }
  }
  ${memberOps.fragments.memberInfo}
`

export const GET_MEMBERS_OP = gql`
  query Members($where: MemberWhereInput) {
    members(where: $where) {
      ...memberInfo
    }
  }
  ${memberOps.fragments.memberInfo}
`

export const CREATE_MEMBER_OP = gql`
  mutation CreateMember($data: MemberCreateInput!) {
    createMember(data: $data) {
      ...memberInfo
    }
  }
  ${memberOps.fragments.memberInfo}
`

export const UPDATE_MEMBER_OP = gql`
  mutation UpdateMember($where: MemberWhereUniqueInput!, $data: MemberUpdateInput!) {
    updateMember(where: $where, data: $data) {
      ...memberInfo
    }
  }
  ${memberOps.fragments.memberInfo}
`

export const DELETE_MEMBER_OP = gql`
  mutation DeleteMember($where: MemberWhereUniqueInput!) {
    deleteMember(where: $where) {
      ...memberInfo
    }
  }
  ${memberOps.fragments.memberInfo}
`