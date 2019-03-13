const PostQuery = {
	posts(parent, args, { prisma }, info) {
		return prisma.query.posts(args, info)
	},

	post(parent, args, { prisma }, info) {
		return prisma.query.post(args, info)
	},
}

export { PostQuery as default }