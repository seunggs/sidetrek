import { getUserEmail } from '../utils/auth'

const PostMutation = {
  async createPost(parent, args, { prisma, request }, info) {
		const email = await getUserEmail(prisma, request, args.where)

		return await prisma.mutation.createPost({
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

	async updatePost(parent, args, { prisma, request }, info) {
		const email = await getUserEmail(prisma, request, args.where)

		const postExists = prisma.exists.Post({
			...args.where,
			author: {
				email
			}
		})

		if (!postExists) { throw new Error('Unable to update post.') }

		return prisma.mutation.updatePost(args, info)
	},

  async deletePost(parent, args, { prisma, request }, info) {
		const email = await getUserEmail(prisma, request, args.where)

		const postExists = prisma.exists.Post({
			...args.where,
			author: {
				email
			}
		})

		if (!postExists) { throw new Error('Unable to delete post.') }

		return prisma.mutation.deletePost(args, info)
  },
}

export { PostMutation as default }