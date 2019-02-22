import React from 'react'

const Emoji = ({ children, ...rest }) => (
  <span
    contentEditable={false}
    onDrop={e => e.preventDefault()}
    {...rest}
  >
    {children}
  </span>
)

export default Emoji