import React, { Fragment } from 'react'
import { Route } from 'react-router-dom'
import Footer from '../components/Footer'

const PublicRoute = ({
  component: Component,
  ...rest
}) => (
    <Route {...rest} component={(props) => {
      return (
        <Fragment>
          <Component {...props} />
          <Footer />
        </Fragment>
      )
    }} />
  )

export default PublicRoute