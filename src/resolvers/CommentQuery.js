const CommentQuery = {
	comments(parent, args, { prisma }, info) {
		return prisma.query.comments(args, info)
	},

	comment(parent, args, { prisma }, info) {
		return prisma.query.comment(args, info)
	},
}

export { CommentQuery as default }