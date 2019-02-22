import React from 'react'
import { connect } from 'react-redux'
import { Route } from 'react-router-dom'
import Spinner from '../components/common/Spinner'

const PublicRoute = ({ component: Component, auth: { authComplete, isAuthenticated }, ...rest }) => (
  <Route {...rest} component={(props) => {
    if (!authComplete) {
      return <Spinner page={true} />
    } else {
      return (
        <Component {...props} />
      )
    }
  }} />
)

const mapStateToProps = ({ auth }) => ({ auth })

export default connect(mapStateToProps)(PublicRoute)