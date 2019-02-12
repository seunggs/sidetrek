import React from 'react'
import ButtonBase from './ButtonBase'

const ButtonGoogleLogin = ({ children, ...rest }) => (
  <ButtonBase className="b--light-red bg-light-red white ph3 pv3" {...rest}>{children}</ButtonBase>
)

export default ButtonGoogleLogin