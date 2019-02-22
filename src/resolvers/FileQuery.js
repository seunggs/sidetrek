const FileQuery = {
  file(parent, { id }, { prisma }, info) {
		return prisma.query.file({ where: { id } }, info)
	},

	files(parent, args, { prisma }, info) {
		return prisma.query.files(args, info)
	},
}

export { FileQuery as default }