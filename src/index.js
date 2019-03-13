import '@babel/polyfill/noConflict'
import server from './server'
import express from 'express'
import path from 'path'
import cors from 'cors'
import compression from 'compression'

// Set up CORS
const whitelist = [
	'http://localhost:3000',
	'http://localhost:4000',
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

server.express.use(compression())
server.express.use(cors(corsOptions))

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
	// Set static folder
	server.express.use(express.static(path.resolve(__dirname, '../client/build')))
	
	// Any routes that gets hit here(above), we're loading into react html file
	server.express.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
	});
}

server.start({ port: process.env.PORT || 4000 }, () => {
	console.log('The server is up!')
})