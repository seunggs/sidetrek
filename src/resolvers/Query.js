import { getUserEmail } from '../utils/auth'
import logger from '../../client/src/utils/logger'

const Query = {
	users(parent, args, { prisma }, info) {
		return prisma.query.users(args, info)
	},

	user(parent, args, { prisma }, info) {
		return prisma.query.user(args, info)
	},

	async me(parent, args, { prisma, request }, info) {
		const email = await getUserEmail(request)
		return prisma.query.user({
			where: {
				email
			}
		})
	},

	file(parent, { id }, { prisma }, info) {
		return prisma.query.file({ where: { id } }, info)
	},

	files(parent, args, { prisma }, info) {
		return prisma.query.files(args, info)
	}
}

export { Query as default }