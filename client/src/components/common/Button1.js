import React from 'react'
import ButtonBase from './ButtonBase'

const Button1 = ({ children, ...rest }) => (
  <ButtonBase className="bg-near-black white ph3 pv3" {...rest}>{children}</ButtonBase>
)

export default Button1