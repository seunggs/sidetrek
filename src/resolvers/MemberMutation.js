import { getUserEmail } from '../utils/auth'

const MemberMutation = {
  async createMember(parent, args, { prisma, request }, info) {
		await getUserEmail(prisma, request, args.where)

		const newMember = await prisma.mutation.createMember(args.data, info)

		return newMember
	},

	async updateMember(parent, args, { prisma, request }, info) {		
		const email = await getUserEmail(prisma, request)
		
		const memberExists = await prisma.exists.Member({
			...args.where,
			user: {
				email
			}
		})

		if (!memberExists) { throw new Error('Unable to update member.') }

		return prisma.mutation.updateMember(args, info)
	},

  async deleteMember(parent, args, { prisma, request }, info) {
		const email = await getUserEmail(prisma, request)
		
		const memberExists = await prisma.exists.Member({
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