import * as auth0 from 'auth0-js'

const webAuth = new auth0.WebAuth({
  domain: 'sidetrek.auth0.com',
  clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
  redirectUri: `${process.env.REACT_APP_CLIENT_URI}/callback`,
  responseType: 'id_token token',
  audience: 'https://sidetrek.com', // API identifier
  scope: 'openid profile',
})

export { webAuth as default }