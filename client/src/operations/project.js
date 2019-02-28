import gql from 'graphql-tag'

/**
 * NOTE: Include 'id' in all queries and mutations so Apollo can match them for automatic cache update
 */

const projectOps = {
  fragments: {
    projectInfo: gql`
      fragment ProjectInfo on Project {
        id
        createdAt
        updatedAt
        published
        featured
        name
        url
        title
        description
        body
        author {
          id
          email
          username
        }
        members {
          user {
            id
            email
            username
          }
        }
        voters {
          id
          email
          username
        }
        favoritedUsers {
          id
          email
          username
        }
        files {
          url
          mimetype
        }
        heroImageId
        milestones {
          id
          title
        }
        posts {
          id
          title
        }
      }
    `
  }
}

export const GET_PROJECT_OP = gql`
  query Project($where: ProjectWhereUniqueInput!) {
    project(where: $where) {
      ...ProjectInfo
    }
  }
  ${projectOps.fragments.projectInfo}
`

export const GET_PROJECTS_OP = gql`
  query Projects($where: ProjectWhereInput) {
    projects(where: $where) {
      ...ProjectInfo
    }
  }
  ${projectOps.fragments.projectInfo}
`

export const CREATE_PROJECT_OP = gql`
  mutation CreateProject($data: ProjectCreateInput!) {
    createProject(data: $data) {
      ...ProjectInfo
    }
  }
  ${projectOps.fragments.projectInfo}
`

export const UPDATE_PROJECT_OP = gql`
  mutation UpdateProject($where: ProjectWhereUniqueInput!, $data: ProjectUpdateInput!) {
    updateProject(where: $where, data: $data) {
      ...ProjectInfo
    }
  }
  ${projectOps.fragments.projectInfo}
`

export const DELETE_PROJECT_OP = gql`
  mutation DeleteProject($where: ProjectWhereUniqueInput!) {
    deleteProject(where: $where) {
      ...ProjectInfo
    }
  }
  ${projectOps.fragments.projectInfo}
`