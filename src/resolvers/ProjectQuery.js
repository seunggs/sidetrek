const ProjectQuery = {
	projects(parent, args, { prisma }, info) {
		return prisma.query.projects(args, info)
	},

	project(parent, args, { prisma }, info) {
		return prisma.query.project(args, info)
	},
}

export { ProjectQuery as default }