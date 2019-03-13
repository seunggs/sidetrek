import * as R from 'ramda'
import { getUserEmail, updateUserInAuth0, deleteUserInAuth0 } from '../utils/auth'

const UserMutation = {
  async createUser(parent, args, { prisma, request }, info) {
		return prisma.mutation.createUser(args, info)
	},

	async updateUser(parent, args, { prisma, request }, info) {
		const email = await getUserEmail(prisma, request, args.where)

		// if user data to be updated includes 'email' or 'password', then update Auth0 as well since it involves auth
		try {
			const { email: newEmail, password: newPassword } = args.data
			if (newEmail || newPassword) {
				const updates = R.mergeAll([newEmail ? { email: newEmail } : {}, newPassword ? { password: newPassword } : {}])
				await updateUserInAuth0(email, updates)
			}
		} catch (err) {
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

  async deleteUser(parent, args, { prisma, request }, info) {
		const email = await getUserEmail(prisma, request, args.where)
		
		// Must also delete in Auth0
		try {
			await deleteUserInAuth0(email)
		} catch (err) {
			throw new Error(err.message)
		}
		
		return prisma.mutation.deleteUser({
			where: {
				email
			}
		}, info)
  },

	async updateManyUsers(parent, args, { prisma, request }, info) {
		const email = await getUserEmail(prisma, request, args.where)

		// Don't allow batch updates for email or password
		if (args.data.email || args.data.password) { throw new Error('Cannot batch update email or password') }

		return prisma.mutation.updateManyUsers(args, info)
	},

	async deleteManyUsers(parent, args, { prisma, request }, info) {
		const email = await getUserEmail(prisma, request, args.where)

		return prisma.mutation.deleteManyUsers(args, info)
	},
}

export { UserMutation as default }