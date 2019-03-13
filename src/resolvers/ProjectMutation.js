import { getUserEmail } from '../utils/auth'

const ProjectMutation = {
  async createProject(parent, args, { prisma, request }, info) {
		const email = await getUserEmail(prisma, request, args.where)

		const newProject = await prisma.mutation.createProject({
			data: {
				...args.data,
				author: {
					connect: {
						email
					}
				},
				members: [],
			},
		})

		const { id } = newProject
		const newMember = await prisma.mutation.createMember({
			data: {
				user: {
					connect: {
						email
					}
				},
				role: 'ADMIN',
				project: {
					connect: {
						id
					}
				}
			}
		})

		return newProject
	},

	async updateProject(parent, args, { prisma, request }, info) {
		const email = await getUserEmail(prisma, request, args.where)

		const projectExists = prisma.exists.Project({
			...args.where,
			author: {
				email
			}
		})

		if (!projectExists) { throw new Error('Unable to update project.') }

		return prisma.mutation.updateProject(args, info)
	},

  async deleteProject(parent, args, { prisma, request }, info) {
		const email = await getUserEmail(prisma, request, args.where)

		const projectExists = prisma.exists.Project({
			...args.where,
			author: {
				email
			}
		})

		if (!projectExists) { throw new Error('Unable to delete project.') }

		return prisma.mutation.deleteProject(args, info)
  },
}

export { ProjectMutation as default }