import React from 'react'
import * as R from 'ramda'

const ButtonBase = ({ className, style, children, ...rest }) => {
  const baseClassName = `br1 bn`
  const finalClassName = `${baseClassName} ${className}`
  return (
    <button className={finalClassName} style={R.merge({ cursor: 'pointer' }, style)} {...rest}>
      {children}
    </button>
  )
}

export default ButtonBase