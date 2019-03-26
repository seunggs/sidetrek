import React from 'react'
import { Link } from 'react-router-dom'

const NavItem = ({ to, children, ...rest }) => (
  <Link to={to} className="link--nav-item" {...rest}>{children}</Link>
)

export default NavItem