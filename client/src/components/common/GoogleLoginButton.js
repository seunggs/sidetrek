import React from 'react'
import ButtonBase from './ButtonBase'

const GoogleLoginButton = ({ children, ...rest }) => (
  <ButtonBase className="bg-light-red white ph3 pv3" {...rest}>{children}</ButtonBase>
)

export default GoogleLoginButton