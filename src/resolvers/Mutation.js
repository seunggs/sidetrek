import { getUserEmail, updateUserInAuth0, deleteUserInAuth0 } from '../utils/auth'
import logger from '../../client/src/utils/logger'
import * as R from 'ramda'
import { uploadToS3 } from '../utils/fileApi'

const Mutation = {
	async createUser(parent, args, { prisma, request }, info) {
		const email = await getUserEmail(request)

		return prisma.mutation.createUser({
			data: {
				...args.data,
			}
		})
	},

	async deleteUser(parent, args, { prisma, request }, info) {
		const email = await getUserEmail(request)

		// Must also delete in Auth0
		try {
			await deleteUserInAuth0(email)
		} catch (err) {
			logger(err.message)
			throw new Error(err.message)
		}

		return prisma.mutation.deleteUser({
			where: {
				email
			}
		}, info)
	},

	async updateUser(parent, args, { prisma, request }, info) {
		const email = await getUserEmail(request)

		// if user data to be updated includes 'email' or 'password', then update Auth0 as well since it involves auth
		try {
			const { email: newEmail, password: newPassword } = args.data
			if (newEmail || newPassword) {
				const updates = R.mergeAll([newEmail ? { email: newEmail } : {}, newPassword ? { password: newPassword } : {}])
				await updateUserInAuth0(email, updates)
			}
		} catch (err) {
			logger(err.message)
			throw new Error(err.message)
		}

		return prisma.mutation.updateUser({
			where: {
				email
			},
			data: {
				...args.data
			}
		}, info)
	},

	async uploadFile(parent, { folder, file }, { prisma }, info) {
		const s3URL = await uploadToS3(prisma, folder, file)
		return s3URL
	},

	async uploadFiles(parent, { folder, files }, { prisma }, info) {
		const s3URLs = await Promise.all(files.map(file => uploadToS3(prisma, folder, file)))
		return s3URLs
	},
}

export { Mutation as default }