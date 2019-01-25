import '@babel/polyfill/noConflict'
import server from './server'
import passport from 'passport'
import { runGoogleStrategy, generateToken } from './utils/auth'

/*
	Strategy: 
	- Use passport to handle Identity Provider Logins outside of graphql
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
		res.json({
			user,
			token: generateToken(user.id)
		})
	}
)

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
	// Set static folder
	// server.express.use(express.static('client/build'));
	server.express.use(express.static(path.resolve(__dirname, 'client', 'build')))
	// Any routes that gets hit here(above), we're loading into react html file
	server.express.get('*', (req, res) => {
		res.send(path.resolve(__dirname, 'client', 'build', 'index.html'));
	});
}

server.start({ port: process.env.PORT || 4000 }, () => {
	console.log('The server is up!')
})