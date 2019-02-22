import logger from '../../client/src/utils/logger'
import { getUserEmail } from '../utils/auth'

const MemberMutation = {
  async createMember(parent, args, { prisma, request }, info) {
		const email = await getUserEmail(prisma, request, args.where)

		return await prisma.mutation.createMember({
			data: {
				...args.data,
				user: {
					connect: {
						email
					}
				}
			}
		}, info)
	},

	async updateMember(parent, args, { prisma, request }, info) {
		const email = await getUserEmail(prisma, request, args.where)

		const memberExists = prisma.exists.Member({
			...args.where,
			user: {
				email
			}
		})

		if (!memberExists) { throw new Error('Unable to update member.') }

		return prisma.mutation.updateMember(args, info)
	},

  async deleteMember(parent, args, { prisma, request }, info) {
		const email = await getUserEmail(prisma, request, args.where)

		const memberExists = prisma.exists.Member({
			...args.where,
			user: {
				email
			}
		})

		if (!memberExists) { throw new Error('Unable to delete member.') }

		return prisma.mutation.deleteMember(args, info)
  },
}

export { MemberMutation as default }