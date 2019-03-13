import { getUserEmail } from '../utils/auth'

const CommentMutation = {
  async createComment(parent, args, { prisma, request }, info) {
		const email = await getUserEmail(prisma, request, args.where)

		return await prisma.mutation.createComment({
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

	async updateComment(parent, args, { prisma, request }, info) {
		const email = await getUserEmail(prisma, request, args.where)

		const commentExists = prisma.exists.Comment({
			...args.where,
			author: {
				email
			}
		})

		if (!commentExists) { throw new Error('Unable to update comment.') }

		return prisma.mutation.updateComment(args, info)
	},

  async deleteComment(parent, args, { prisma, request }, info) {
		const email = await getUserEmail(prisma, request, args.where)

		const commentExists = prisma.exists.Comment({
			...args.where,
			author: {
				email
			}
		})

		if (!commentExists) { throw new Error('Unable to delete comment.') }

		return prisma.mutation.deleteComment(args, info)
  },
}

export { CommentMutation as default }