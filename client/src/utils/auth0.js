import * as auth0 from 'auth0-js'

const webAuth = new auth0.WebAuth({
  domain: 'sidetrek.auth0.com',
  clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
  redirectUri: `${window.location.protocol}//${window.location.hostname}${process.env.NODE_ENV !== 'production' ? ':' + window.location.port : ''}/callback`,
  responseType: 'id_token token',
  audience: 'https://sidetrek.com', // API identifier
  scope: 'openid profile',
})

export { webAuth as default }