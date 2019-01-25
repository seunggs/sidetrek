import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import prisma from '../prisma'

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy

export const generateToken = (userId) => {
	return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30 days' })
}

export const getUserId = (request, requireAuth = true) => {
  const header = request.request ? request.request.headers.authorization : request.connection.context.Authorization

  if (header) {
      const token = header.replace('Bearer ', '')
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      return decoded.userId
  }

  if (requireAuth) {
      throw new Error('Authentication required')
  } 
  
  return null
}

export const hashPassword = (password) => {
	return bcrypt.hash(password, 10)
}

export const runGoogleStrategy = (passport) => {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
  }, (accessToken, refreshToken, profile, done) => {
    const { id, emails } = profile
    const email = emails[0].value
    let user = await prisma.query.user({
      where: {
        OR: [
          { id },
          { email }
        ]
      }
    })

    if (!user) {
      // User doesn't exist; create one
      user = await prisma.mutation.createUser({
        data: {
          id,
          type: 'google',
          email,
        }
      })
    }

    return done(null, newUser)
  }))
}