import { ManagementClient } from 'auth0'
import * as R from 'ramda'
import jwt from 'jsonwebtoken'
import jwks from 'jwks-rsa'
import logger from '../../client/src/utils/logger'
import { APP_URL, AUTH0_URL } from './constants'
import { getQuery } from './query'

const auth0 = new ManagementClient({
  domain: AUTH0_URL.replace('https://', ''),
  clientId: process.env.AUTH0_MANAGEMENT_API_CLIENT_ID,
  clientSecret: process.env.AUTH0_MANAGEMENT_API_CLIENT_SECRET,
  scope: 'read:users update:users delete:users'
})

export const updateUserInAuth0 = (email, updates) => {
	if (!email) { throw new Error('Unable to update user.') }

	// Since Auth0 saves all emails in lowercase, but social login providers have different rules,
	// search for both to catch all of user's accounts in Auth0
	const allLowerCaseEmail = R.toLower(email)
	return Promise.all([auth0.getUsersByEmail(email), auth0.getUsersByEmail(allLowerCaseEmail)])
		.then(([users1, users2]) => {
			const users = R.uniqBy(R.prop('user_id'))(R.concat(users1, users2))

			// if user has a social login, then updating user email is not possible
			if (updates.email) {
				const hasSocialLogin = R.compose(
					R.not,
					R.isEmpty,
					R.reject(userId => R.includes('auth0', userId)),
					R.pluck('user_id'),
				)(users)
				
				if (hasSocialLogin) {
					throw new Error('Cannot update your email because you have a social login.')
				}
			}

			// if the update includes password, make sure only auth0 login is updated with the new password			
			let passwordUpdatedUsers = []
			if (updates.password) {
				const passwordUpdate = updates.password
				const auth0User = R.find(user => R.includes('auth0', user.user_id))(users)
				passwordUpdatedUsers = auth0User ? [auth0.updateUser({ id: auth0User.user_id }, passwordUpdate)] : []
			}
			
			const updatesWithoutPassword = R.omit('password', updates)
			const updatedUsersPromises = R.map(user => {
				const { user_id } = user
				return auth0.updateUser({ id: user_id }, updatesWithoutPassword)
			})(users)
			return Promise.all(R.concat(passwordUpdatedUsers, updatedUsersPromises))
		})
		.then(updatedUsers => {
			logger.info('Updating user successful!')
			return updatedUsers
		})
}

export const deleteUserInAuth0 = email => {
	if (!email) { throw new Error('Unable to update user.') }
	
	// Since Auth0 saves all emails in lowercase, but social login providers have different rules,
	// search for both to catch all of user's accounts in Auth0
	const allLowerCaseEmail = R.toLower(email)
	return Promise.all([auth0.getUsersByEmail(email), auth0.getUsersByEmail(allLowerCaseEmail)])
		.then(([users1, users2]) => {
			const users = R.uniqBy(R.prop('user_id'))(R.concat(users1, users2))
			logger.info('users to be deleted in Auth0', users)

			const deletedUsersPromises = R.map(user => {
				const { user_id } = user
				return auth0.deleteUser({ id: user_id })
			})(users)
			return Promise.all(deletedUsersPromises)
		})
		.then(deletedUsers => {
			logger.info('Deleting user successful!')
			return deletedUsers
		})
}

const jwksClient = jwks({
	jwksUri: `${AUTH0_URL}/.well-known/jwks.json`
})

function getKey(header, callback) {
	jwksClient.getSigningKey(header.kid, (err, key) => {
		const signingKey = key.publicKey || key.rsaPublicKey
		callback(null, signingKey)
	})
}

const verifyJwt = (accessToken) => (new Promise((resolve, reject) => {
	jwt.verify(accessToken, getKey, {}, async (err, decoded) => {
		if (err) {
			console.log('jwt verification failure:')
			console.log(err)
			reject('Authentication failed')
		}
		// logger.info('decoded', decoded)
		const email = decoded[`${APP_URL}/email`]
		resolve(email)
	})
}))

export const getMyEmail = async (request, { requireAuth = true } = {}) => {
	const header = request.request ? request.request.headers.authorization : request.connection.context.Authorization
	// logger.info('header', header)

	if (header) {
		const accessToken = header.replace('Bearer ', '')
		// logger.info(accessToken)

		try {
			return await verifyJwt(accessToken)
		} catch (err) {
			throw new Error(err)
		}
	}

	if (requireAuth) {
		throw new Error('Authentication required')
	}

	return null
}

// getMyEmail gets the email of the user making the call (after authorization), whereas...
// getUserEmail gets the email requested from the query (i.e. from Prisma's 'where' variable) after checking user role
// If the user is root, return requested email (root can update/delete other users), but otherwise, return caller's email
export const getUserEmail = async (prisma, request, where) => {
	const myEmail = await getMyEmail(request)

	// If another user is not requested, just return caller's email
	if (!where) { return myEmail }
	
	// If requested email is the same as caller's email, return caller's email
	if (where.email === myEmail) { return myEmail }
	
	const meQuery = prisma.query.user({
		where: {
			email: myEmail
		}
	})

	const requestedUserQuery = prisma.query.user({
		where: {
			...where
		}
	})

	const [me, requestedUser] = await Promise.all([meQuery, requestedUserQuery])
		.then(([meData, requestedUserData]) => {
			return [meData.data.user, requestedUserData.data.user]
		})
	
	// only allow the user to update its own email if not ROOT
	return me.role === 'ROOT' ? requestedUser.email : myEmail
}