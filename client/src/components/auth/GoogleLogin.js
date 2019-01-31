import React from 'react'
import webAuth from '../../utils/auth0'
import GoogleLoginButton from '../common/GoogleLoginButton'

const handleGoogleLoginClick = () => {
  webAuth.authorize({
    connection: 'google-oauth2'
  })
}

const GoogleLogin = () => {
  return (
    <GoogleLoginButton onClick={handleGoogleLoginClick}>
      Google Login
    </GoogleLoginButton>
  )
}

export default GoogleLogin