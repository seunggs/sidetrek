import { getMyEmail } from '../utils/auth'

const UserQuery = {
	async me(parent, args, { prisma, request }, info) {
		const email = await getMyEmail(request)
		return prisma.query.user({
			where: {
				email
			}
		})
	},

	user(parent, args, { prisma }, info) {
		return prisma.query.user(args, info)
	},

	users(parent, args, { prisma }, info) {
		return prisma.query.users(args, info)
	},
}

export { UserQuery as default }