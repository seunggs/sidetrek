import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import prisma from '../prisma'
import jwks from 'jwks-rsa'

const jwksClient = jwks({
	jwksUri: 'https://sidetrek.auth0.com/.well-known/jwks.json'
})
function getKey(header, callback){
  jwksClient.getSigningKey(header.kid, (err, key) => {
    const signingKey = key.publicKey || key.rsaPublicKey
    callback(null, signingKey)
  })
}

export const generateToken = (userId) => {
	return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30 days' })
}

export const getUserId = (request, { requireAuth = true } = {}) => {
	const header = request.request ? request.request.headers.authorization : request.connection.context.Authorization
	console.log('header', header)

	if (header) {
		const accessToken = header.replace('Bearer ', '')
		jwt.verify(accessToken, getKey, {}, (err, decoded) => {
			if (err) {
				console.log('jwt verification failure:')
				console.log(err)
			}
			console.log('decoded: ', decoded)
			const { sub: userId, scope } = decoded
			return userId
		})

		// Also handle admin scope if any
	}

	console.log('THIS SHOULD NOT RUN!!')
	if (requireAuth) {
		throw new Error('Authentication required')
	}

	return null
}

export const hashPassword = (password) => {
	return bcrypt.hash(password, 10)
}
