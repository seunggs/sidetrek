import React from 'react'
import { Link } from 'react-router-dom'
import Header from './Header'
import SignupForm from './auth/SignupForm'
import GoogleLogin from './auth/GoogleLogin'

const SignupPage = () => {
  return (
    <div>
      <Header />

      <div>Sign Up</div>

      <div>
        <SignupForm />
      </div>

      <div>
        <GoogleLogin />
      </div>

      <Link to='/'>Go to home</Link>
    </div>
  )
}

export default SignupPage