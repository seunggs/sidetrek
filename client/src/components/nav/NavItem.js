import React from 'react'
import { Link } from 'react-router-dom'

const NavItem = ({ to, children }) => (
  <Link to={to} className="link--nav-item">{children}</Link>
)

export default NavItem