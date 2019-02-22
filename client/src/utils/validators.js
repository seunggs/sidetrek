/* eslint-disable no-throw-literal */

import * as Yup from 'yup'
import * as R from 'ramda'
import logger from './logger'
import { GET_USERS_OP } from '../operations/user'
import { GET_PROJECTS_OP } from '../operations/project'

/*
  These are field level validators for Formik <Field validate={} />
  These are mostly async validations
*/

export const validateEmail = ({ email, client, setValidatingEmail }) => {
  // Sync validation
  if (!Yup.string().required().isValidSync(email)) {
    throw 'Email is required.'
  }
  if (!Yup.string().email().isValidSync(email)) {
    throw 'Email is not valid.'
  }

  // Async validation
  setValidatingEmail(true)
  
  return client.query({
    variables: { where: { email } },
    query: GET_USERS_OP,
  })
    .then(usersData => {
      const users = usersData.data.users
      setValidatingEmail(false)

      // If user exists
      if (!R.isEmpty(users)) {
        // First check if it's email-password signup
        // This is to avoid user getting stuck and not being able to login in via email-password since there's no account in Auth0
        const user = R.head(users)
        if (user.hasPassword) {
          // If the user already signed up via email-password, throw
          return Promise.reject({ error: 'user_exists', message: 'This email already exists.' })
        }
      }
    })
    .catch(err => {
      setValidatingEmail(false)
      if (err.error === 'user_exists') {
        throw err.message
      } else {
        logger.error(err)
        throw 'Something went wrong on our end - please try again later.'
      }
    })
}

export const validateUsername = ({ username, client, setValidatingUsername }) => {
  // Sync validation
  if (!Yup.string().required().isValidSync(username)) {
    throw 'Username is required.'
  }
  if (!Yup.string().min(2).isValidSync(username)) {
    throw 'Username should be at least 2 characters.'
  }
  if (!Yup.string().matches(/^\w+$/).isValidSync(username)) {
    // Allows only alphanumeric characters including _: [a-zA-Z_0-9]
    throw 'Username cannot contain special characters.'
  }

  // Async validation
  setValidatingUsername(true)
  return client.query({
    variables: { where: { username } },
    query: GET_USERS_OP,
  })
    .then(usersData => {
      const users = usersData.data.users
      setValidatingUsername(false)

      // If user exists
      if (!R.isEmpty(users)) {
        return Promise.reject({ error: 'user_exists', message: 'Sorry, this username is not available.' })
      }
    })
    .catch(err => {
      setValidatingUsername(false)
      if (err.error === 'user_exists') {
        throw err.message
      } else {
        logger.error(err)
        throw 'Something went wrong on our end - please try again later.'
      }
    })
}

export const validateProjectName = ({ name, client, setValidatingName }) => {
  // Sync validation
  if (!Yup.string().required().isValidSync(name)) {
    throw 'Project name is required.'
  }
  if (!Yup.string().min(2).isValidSync(name)) {
    throw 'Project name should be at least 2 characters.'
  }
  if (!Yup.string().matches(/^\w+$/).isValidSync(name)) {
    // Allows only alphanumeric characters including _: [a-zA-Z_0-9]
    throw 'Project name cannot contain special characters.'
  }

  // Async validation
  setValidatingName(true)
  return client.query({
    variables: { where: { name } },
    query: GET_PROJECTS_OP,
  })
    .then(projectsData => {
      const projects = projectsData.data.projects
      setValidatingName(false)

      // If user exists
      if (!R.isEmpty(projects)) {
        return Promise.reject({ error: 'project_exists', message: 'Sorry, this project name is not available.' })
      }
    })
    .catch(err => {
      setValidatingName(false)
      if (err.error === 'project_exists') {
        throw err.message
      } else {
        logger.error(err)
        throw 'Something went wrong on our end - please try again later.'
      }
    })
}