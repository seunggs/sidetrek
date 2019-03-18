import React from 'react'
import { Link } from 'react-router-dom'
import Header from './Header'
import LoginForm from './auth/LoginForm'
import GoogleLogin from './auth/GoogleLogin'
import Divider from './common/Divider'

const LoginPage = () => {
  return (
    <div>
      <Header />

      <div className="row">
        <div className="col-xs-12 col-md-4 col-md-offset-4">
          <div className="f3 fw6 mb4 tc">Login to Sidetrek</div>

          <div>
            <GoogleLogin block />
          </div>

          <Divider style={{ fontSize: '1.5rem', color: "#bbb", paddingTop: '1.5rem', paddingBottom: '1.5rem' }}>or login with email</Divider>

          <LoginForm />
        </div>
      </div>


      <Link to='/'>Go to home</Link>
    </div>
  )
}

export default LoginPage