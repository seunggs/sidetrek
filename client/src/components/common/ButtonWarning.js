import React from 'react'
import ButtonBase from './ButtonBase'

const ButtonPrimary = ({ children, ...rest }) => (
  <ButtonBase className="ba b--red red ph3 pv3" {...rest}>{children}</ButtonBase>
)

export default ButtonPrimary