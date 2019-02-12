import React from 'react'
import Header from './Header'
import UsernameForm from './auth/UsernameForm'

const SetUsernamePage = () => {
  return (
    <div>
      <Header />

      <div>Set username</div>

      <div>
        <UsernameForm />
      </div>
    </div>
  )
}

export default SetUsernamePage