import gql from 'graphql-tag'

/**
 * NOTE: Include 'id' in all queries and mutations so Apollo can match them for automatic cache update
 */

const milestoneOps = {
  fragments: {
    milestoneInfo: gql`
      fragment milestoneInfo on Milestone {
        id
        createdAt
        updatedAt
        title
        description
        author {
          id
          username
        }
        deadline
        project {
          id
        }
        reactions {
          id
          author {
            id
            username
          }
          emoji
        }
        achievedBy {
          id
          user {
            id
            username
          }
        }
        order
      }
    `
  }
}

export const GET_MILESTONE_OP = gql`
  query Milestone($where: MilestoneWhereUniqueInput!) {
    milestone(where: $where) {
      ...milestoneInfo
    }
  }
  ${milestoneOps.fragments.milestoneInfo}
`

export const GET_MILESTONES_OP = gql`
  query Milestones($where: MilestoneWhereInput) {
    milestones(where: $where) {
      ...milestoneInfo
    }
  }
  ${milestoneOps.fragments.milestoneInfo}
`

export const CREATE_MILESTONE_OP = gql`
  mutation CreateMilestone($data: MilestoneCreateInput!) {
    createMilestone(data: $data) {
      ...milestoneInfo
    }
  }
  ${milestoneOps.fragments.milestoneInfo}
`

export const UPDATE_MILESTONE_OP = gql`
  mutation UpdateMilestone($where: MilestoneWhereUniqueInput!, $data: MilestoneUpdateInput!) {
    updateMilestone(where: $where, data: $data) {
      ...milestoneInfo
    }
  }
  ${milestoneOps.fragments.milestoneInfo}
`

export const DELETE_MILESTONE_OP = gql`
  mutation DeleteMilestone($where: MilestoneWhereUniqueInput!) {
    deleteMilestone(where: $where) {
      ...milestoneInfo
    }
  }
  ${milestoneOps.fragments.milestoneInfo}
`