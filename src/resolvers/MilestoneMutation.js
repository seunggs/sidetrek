import { getUserEmail } from '../utils/auth'

const MilestoneMutation = {
  async createMilestone(parent, args, { prisma, request }, info) {
		const email = await getUserEmail(prisma, request, args.where)

		return await prisma.mutation.createMilestone({
			data: {
				...args.data,
				author: {
					connect: {
						email
					}
				}
			}
		}, info)
	},

	async updateMilestone(parent, args, { prisma, request }, info) {
		const email = await getUserEmail(prisma, request, args.where)

		const milestoneExists = prisma.exists.Milestone({
			...args.where,
			author: {
				email
			}
		})

		if (!milestoneExists) { throw new Error('Unable to update milestone.') }

		return prisma.mutation.updateMilestone(args, info)
	},

  async deleteMilestone(parent, args, { prisma, request }, info) {
		const email = await getUserEmail(prisma, request, args.where)

		const milestoneExists = prisma.exists.Milestone({
			...args.where,
			author: {
				email
			}
		})

		if (!milestoneExists) { throw new Error('Unable to delete milestone.') }

		return prisma.mutation.deleteMilestone(args, info)
  },
}

export { MilestoneMutation as default }