import React from 'react'
import * as R from 'ramda'

const ButtonEditor = ({ children, size = 'default', theme = 'light', className = '', style = {}, ...rest }) => {
  /**
   * theme: dark || light
   * size: default || large
   */

  let sizeStyle
  switch(size) {
    case 'large':
      sizeStyle = {
        padding: '1rem 1.3rem'
      }
      break
    default:
      sizeStyle = {
        padding: '0.1rem 0.6rem'
      }
  }
  const baseStyle = R.merge({
    fontWeight: '500',
    color: theme === 'dark' ? '#fff' : '#000',
    outline: 0,
    cursor: 'pointer',
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  }, sizeStyle)
  return (
    <button className={`${className} o-50 glow`} style={R.merge(baseStyle, style)} {...rest}>{children}</button>
  )
}

export default ButtonEditor