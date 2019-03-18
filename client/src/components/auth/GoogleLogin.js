import React from 'react'
import webAuth from '../../utils/auth0'
import ButtonGoogleLogin from '../common/ButtonGoogleLogin'

const handleGoogleLoginClick = () => {
  webAuth.authorize({
    connection: 'google-oauth2'
  })
}

const GoogleLogin = ({ ...rest }) => {
  return (
    <ButtonGoogleLogin onClick={handleGoogleLoginClick} {...rest}>
      Login with Google
    </ButtonGoogleLogin>
  )
}

export default GoogleLogin