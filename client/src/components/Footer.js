import React, { Component } from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className="tc pv4 bt b--light-gray">
      <Link to="/privacy" className="gray mh4">Privacy Policy</Link>
      <Link to="/terms-of-use" className="gray mh4">Terms of Use</Link>
    </div>
  )
}

export default Footer