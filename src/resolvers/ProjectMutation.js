import { getUserEmail } from '../utils/auth'
import { checkMemberIsAdmin } from '../utils/member'

const ProjectMutation = {
  async createProject(parent, args, { prisma, request }, info) {
		await getUserEmail(prisma, request, args.where)

		const newProject = await prisma.mutation.createProject(args.data, info)

		return newProject
	},

	async updateProject(parent, args, { prisma, request }, info) {
		const projectId = getProjectId(prisma, args.where)
		checkMemberIsAdmin(prisma, request, projectId)
		
		const projectExists = await prisma.exists.Project(args.where)

		if (!projectExists) { throw new Error('Unable to update project.') }

		return prisma.mutation.updateProject(args, info)
	},

  async deleteProject(parent, args, { prisma, request }, info) {
		const projectId = getProjectId(prisma, args.where)
		checkMemberIsAdmin(prisma, request, projectId)

		const projectExists = await prisma.exists.Project(args.where)

		if (!projectExists) { throw new Error('Unable to delete project.') }

		return prisma.mutation.deleteProject(args, info)
  },
}

export { ProjectMutation as default }