import React from 'react'
import { Link } from 'react-router-dom'
import gql from "graphql-tag"
import { Query } from 'react-apollo'
import Header from './Header'
import LoginForm from './auth/LoginForm'
import SignupForm from './auth/SignupForm'
import GoogleLogin from './auth/GoogleLogin'
import Spinner from './common/Spinner'

const GET_ME = gql`
  {
    me {
      id
    }
  }
`

const LoginPage = () => {
  return (
    <div>
      <Header />

      <div>Login</div>

      <div>
        <LoginForm />
      </div>

      <div>
        <SignupForm />
      </div>

      <div>
        <GoogleLogin />
      </div>

      <div>
        <Query query={GET_ME} fetchPolicy="cache-and-network" errorPolicy="ignore">
          {({ loading, error, data }) => {
            if (error) return `Error! ${error.message}`
            if (data) return `${JSON.stringify(data)}`
            return (
              <div>hello</div>
            )
          }}
        </Query>
      </div>

      <Link to='/home'>Go to home</Link>
    </div>
  )
}

export default LoginPage