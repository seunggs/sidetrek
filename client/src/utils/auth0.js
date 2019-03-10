import * as auth0 from 'auth0-js'
import { REACT_APP_AUTH0_DOMAIN, REACT_APP_AUTH0_AUDIENCE } from './constants'

const webAuth = new auth0.WebAuth({
  domain: REACT_APP_AUTH0_DOMAIN,
  clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
  redirectUri: `${window.location.protocol}//${window.location.hostname}${process.env.NODE_ENV !== 'production' ? ':' + window.location.port : ''}/callback`,
  responseType: 'id_token token',
  audience: REACT_APP_AUTH0_AUDIENCE, // API identifier
  scope: 'openid profile',
})

export { webAuth as default }