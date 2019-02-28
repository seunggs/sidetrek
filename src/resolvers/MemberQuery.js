const MemberQuery = {
	members(parent, args, { prisma }, info) {
		return prisma.query.members(args, info)
	},

	member(parent, args, { prisma }, info) {
		return prisma.query.member(args, info)
	},
}

export { MemberQuery as default }