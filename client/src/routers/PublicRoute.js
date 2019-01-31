import React from 'react'
import { connect } from 'react-redux'
import { Route } from 'react-router-dom'

const PublicRoute = ({ component: Component, auth: { isAuthenticated }, ...rest }) => (
  <Route {...rest} render={props => (
    <Component {...props} />
  )} />
)

const mapStateToProps = ({ auth }) => ({ auth })

export default connect(mapStateToProps)(PublicRoute)