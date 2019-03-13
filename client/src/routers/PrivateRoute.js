import React from 'react'
import { connect } from 'react-redux'
import { Route, Redirect } from 'react-router-dom'
import Spinner from '../components/common/Spinner'

const PrivateRoute = ({
  component: Component,
  auth: { authComplete, isAuthenticated },
  ...rest
}) => (
  <Route {...rest} component={(props) => {
    const isLoading = !authComplete

    if (isLoading) {
      return (
        <div>
          <Spinner />
        </div>
      )
    }
    return (
      isAuthenticated ? (
        <Component {...props} />
      ) : (
        <Redirect to="/" />
      )
    )
  }} />
)

const mapStateToProps = state => ({ 
  auth: state.auth,
})

export default connect(mapStateToProps)(PrivateRoute)