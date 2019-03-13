import React from 'react'
import * as R from 'ramda'
import { connect } from 'react-redux'
import { Route, Redirect } from 'react-router-dom'
import Spinner from '../components/common/Spinner'

const AdminRoute = ({
  component: Component,
  auth: { authComplete, isAuthenticated },
  user,
  ...rest
}) => {
  return (
    <Route {...rest} component={(props) => {
      const isLoading = !authComplete || (isAuthenticated && R.isEmpty(user))

      if (isLoading) {
        return (
          <div>
            <Spinner />
          </div>
        )
      }
      
      const isAdmin = user.role === 'ADMIN' || user.role === 'ROOT'
      
      return (
        isAuthenticated && isAdmin ? (
          <Component {...props} />
        ) : (
          <Redirect to="/" />
        )
      )
    }} />
  )
}

const mapStateToProps = state => ({ 
  auth: state.auth,
  user: state.user,
})

export default connect(mapStateToProps)(AdminRoute)