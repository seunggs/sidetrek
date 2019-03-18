import {
  SET_PROJECTS,
  CREATE_PROJECT,
  UPDATE_PROJECT,
  DELETE_PROJECT,
} from './types'
import {
  GET_PROJECTS_OP,
  CREATE_PROJECT_OP,
  UPDATE_PROJECT_OP,
  DELETE_PROJECT_OP,
} from '../operations/project'

export const setProjects = projects => ({
  type: SET_PROJECTS,
  projects
})

export const createProject = project => ({
  type: CREATE_PROJECT,
  project
})

export const updateProject = project => ({
  type: UPDATE_PROJECT,
  project
})

export const deleteProject = project => ({
  type: DELETE_PROJECT,
  project
})

export const startCreateProject = (client, project) => async (dispatch) => {
  const createdProject = await client.mutate({
    mutation: CREATE_PROJECT_OP,
    variables: { data: project },
  })

  dispatch(createProject(createdProject.data.createProject))

  return createdProject
}

export const startSetProjects = client => dispatch => {
  return client.query({
    query: GET_PROJECTS_OP
  })
    .then(projectsData => {
      const { projects } = projectsData.data

      // Update Redux state
      dispatch(setProjects(projects))

      return projects
    })
}

export const startUpdateProject = (client, projectId, updates) => async (dispatch) => {
  const updatedProject = await client.mutate({
    mutation: UPDATE_PROJECT_OP,
    variables: {
      where: { id: projectId },
      data: updates
    },
  })

  dispatch(updateProject(updatedProject.data.updateProject))

  return updatedProject
}

export const startDeleteProject = (client, projectId) => async (dispatch) => {
  const deletedProject = await client.mutate({
    mutation: DELETE_PROJECT_OP,
    variables: {
      where: { id: projectId }
    },
  })

  dispatch(deleteProject(deletedProject.data.deleteProject))

  return deletedProject
}