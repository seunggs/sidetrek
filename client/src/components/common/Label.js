import React from 'react'

const MyLabel = ({ name, children, ...rest }) => (
  <label htmlFor={name} className="f6 silver" {...rest}>{children}</label>
)

export default MyLabel