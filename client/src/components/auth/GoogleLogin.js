import React from 'react'
import webAuth from '../../utils/auth0'
import ButtonGoogleLogin from '../common/ButtonGoogleLogin'

const handleGoogleLoginClick = () => {
  webAuth.authorize({
    connection: 'google-oauth2'
  })
}

const GoogleLogin = () => {
  return (
    <ButtonGoogleLogin onClick={handleGoogleLoginClick}>
      Google Login
    </ButtonGoogleLogin>
  )
}

export default GoogleLogin