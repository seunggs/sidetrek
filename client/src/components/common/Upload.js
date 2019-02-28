import React from 'react'

const Upload = ({ children, onChange, ...rest }) => (
  <span {...rest}>
    <label htmlFor="file" className="dib pointer o-50 glow"><span style={{ pointerEvents: 'none' }}>{children}</span></label>
    <input id="file" type="file" onChange={onChange} style={{ display: 'none' }} />
  </span>
)

export default Upload