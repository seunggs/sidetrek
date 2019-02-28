import React from 'react'
import { Router, Route, Switch } from 'react-router-dom'
import { history } from '../App'
import PublicRoute from './PublicRoute'
import PrivateRoute from './PrivateRoute'
import CallBack from '../components/auth/CallBack'
import Test from '../components/Test'
import NotFoundPage from '../components/NotFoundPage'
import HomePage from '../components/HomePage'
import LoginPage from '../components/LoginPage'
import SignupPage from '../components/SignupPage'
import UsernamePage from '../components/UsernamePage'
import ProfilePage from '../components/ProfilePage'
import SettingsPage from '../components/SettingsPage'
import NewProjectPage from '../components/project/NewProjectPage'
import NewPostPage from '../components/post/NewPostPage'

const handleAuth = (store, client, auth, nextState) => {
  console.log('Auth callback initiating...')
  if (/access_token|id_token|error/.test(nextState.location.hash)) {
    auth().handleAuth(store, client)
  }
}

const AppRouter = ({ store, auth, client }) => (
  <Router history={history}>
    <div>
      <Switch>
        <PublicRoute path="/" component={HomePage} exact={true} />
        <PublicRoute path="/login" component={LoginPage} />
        <PublicRoute path="/signup" component={SignupPage} />
        <Route path="/callback" render={props => {
          console.log('/callback called')
          handleAuth(store, client, auth, props)
          return <CallBack {...props} />
        }} />
        <PrivateRoute path="/username" component={UsernamePage} />
        <PublicRoute path="/profile/:username" component={ProfilePage} />
        <PrivateRoute path="/settings" component={SettingsPage} />
        <PrivateRoute path="/project/new" component={NewProjectPage} />
        <PrivateRoute path="/post/new" component={NewPostPage} />
        <PublicRoute path="/test" component={Test} />
        <PublicRoute component={NotFoundPage} />
      </Switch>
    </div>
  </Router>
)

export default AppRouter
