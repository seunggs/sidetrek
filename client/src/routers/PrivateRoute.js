import React from 'react'
import { connect } from 'react-redux'
import { Route, Redirect } from 'react-router-dom'

const PrivateRoute = ({ component: Component, auth: { isAuthenticated }, ...rest }) => (
  <Route {...rest} component={(props) => (
    isAuthenticated ? (
      <Component {...props} />
    ) : (
      <Redirect to="/" />
    )
  )} />
)

const mapStateToProps = ({ auth }) => ({ auth })

export default connect(mapStateToProps)(PrivateRoute)