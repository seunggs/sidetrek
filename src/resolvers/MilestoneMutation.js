import { getUserEmail } from '../utils/auth'

const MilestoneMutation = {
  async createMilestone(parent, args, { prisma, request }, info) {
		await getUserEmail(prisma, request, args.where)

		const newMilestone = await prisma.mutation.createMilestone(args.data, info)

		return newMilestone
	},

	async updateMilestone(parent, args, { prisma, request }, info) {
		await getUserEmail(prisma, request)
		
		const milestoneExists = await prisma.exists.Milestone({
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

		const milestoneExists = await prisma.exists.Milestone({
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