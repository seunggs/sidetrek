import React from 'react'
import ButtonBase from './ButtonBase'

const ButtonPrimary = ({ children, ...rest }) => (
  <ButtonBase className="b--near-black bg-near-black white ph3 pv3" {...rest}>{children}</ButtonBase>
)

export default ButtonPrimary