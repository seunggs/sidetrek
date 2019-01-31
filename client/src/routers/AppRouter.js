import React from 'react'
import { Router, Route, Switch } from 'react-router-dom'
import { history } from '../App'
import PublicRoute from './PublicRoute'
import PrivateRoute from './PrivateRoute'
import CallBack from '../components/auth/CallBack'
import NotFoundPage from '../components/NotFoundPage'
import LoginPage from '../components/LoginPage'
import HomePage from '../components/HomePage'
import AccountPage from '../components/AccountPage'

const handleAuth = (store, auth, nextState) => {
  console.log('Auth callback initiating...')
  if (/access_token|id_token|error/.test(nextState.location.hash)) {
    auth().handleAuth(store)
  }
}

const AppRouter = ({ store, auth }) => (
  <Router history={history}>
    <div>
      <Switch>
        <PublicRoute path="/" component={LoginPage} exact={true} />
        <Route path="/callback" render={props => {
          console.log('/callback called')
          handleAuth(store, auth, props)
          return <CallBack {...props} />
        }} />
        <PublicRoute path="/home" component={HomePage} />
        <PrivateRoute path="/account" component={AccountPage} />
        <PublicRoute component={NotFoundPage} />
      </Switch>
    </div>
  </Router>
)

export default AppRouter
