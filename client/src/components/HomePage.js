import React from 'react'
import { Link } from 'react-router-dom'
import Header from './Header'

const HomePage = () => {
  return (
    <div>
      <Header />
      <div>I'm HomePage</div>
      <div className="mt3"><Link to='/login'>Login</Link></div>
      <div className="mt3"><Link to='/signup'>Sign Up</Link></div>
    </div>
  )
}

export default HomePage