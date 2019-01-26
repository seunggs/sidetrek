import React from 'react'
import { PRISMA_HTTP_URL } from '../utils/constants'

const LoginPage = () => {
  return (
    <div>
      <div>I'm LoginPage</div>
      <div><a href={`${PRISMA_HTTP_URL}/auth/google`}>Login to Google</a></div>
    </div>
  )
}

export default LoginPage