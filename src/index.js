import '@babel/polyfill/noConflict'
import server from './server'
import express from 'express'
import path from 'path'
import passport from 'passport'
import { runGoogleStrategy, generateToken } from './utils/auth'
import sseExpress from 'sse-express'
import cors from 'cors'

// Set up CORS
const whitelist = [
	'http://localhost:3000',
	'http://127.0.0.1:3000',
	'http://localhost:4000',
	'http://127.0.0.1:4000',
	'https://sidetrek-node-stg.herokuapp.com',
	'https://sidetrek.com',
	'https://www.sidetrek.com',
]
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
server.express.use(cors(corsOptions))

/*
	Auth Strategy: 
	- Use Passport to handle Identity Provider Logins outside of graphql
	- On successful authentication from the Identity Provider, save on a different DB table
		other than the User table (for username/password login) & send back jwt based on the id
	- For future calls requiring authentication, send jwt for verification
*/ 
runGoogleStrategy(passport)
server.express.use(passport.initialize())

server.express.get('/auth/google',
	passport.authenticate('google', { session: false, scope: ['email', 'profile'] })
)

server.express.get('/auth/google/callback', 
	passport.authenticate('google', { session: false, failureRedirect: '/login' }),
	(req, res) => {
		// req.user contains the user obj
		const { user } = req
		console.log(user)
		// res.sse('googleAuthenticated', {
		// 	user,
		// 	token: generateToken(user.id)
		// })
		res.redirect('/')
	}
)

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
	// Set static folder
	server.express.use(express.static(path.resolve(__dirname, 'client', 'build')))
	// Any routes that gets hit here(above), we're loading into react html file
	server.express.get('*', (req, res) => {
		res.send(path.resolve(__dirname, 'client', 'build', 'index.html'));
	});
}

server.start({ port: process.env.PORT || 4000 }, () => {
	console.log('The server is up!')
})