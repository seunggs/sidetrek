const MilestoneQuery = {
	milestones(parent, args, { prisma }, info) {
		return prisma.query.milestones(args, info)
	},

	milestone(parent, args, { prisma }, info) {
		return prisma.query.milestone(args, info)
	},
}

export { MilestoneQuery as default }