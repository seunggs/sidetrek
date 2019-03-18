import * as R from 'ramda'
import { getMyEmail } from './auth'

const getMemberRoleByProjectId = async (prisma, request, projectId) => {
	const myEmail = await getMyEmail(request)
	const userData = await prisma.query.user({
		where: {
			email: myEmail
		}
  }, '{ members { id role project { id } } }')
  const { members } = userData.data
  const member = R.find(member => member.project.id === projectId)(members)
  return member ? member.role : null
}

export const checkMemberIsModerator = async (prisma, request, projectId) => {
  const role = await getMemberRoleByProjectId(prisma, request, projectId)
  const memberIsModerator = !R.isNil(role) && (role === 'ADMIN' || role === 'MODERATOR')
  
  if (!memberIsModerator) { throw new Error('Action not authorized - lack of role permission.') }
  
  return true
}

export const checkMemberIsAdmin = async (prisma, request, projectId) => {
  const role = await getMemberRoleByProjectId(prisma, request, projectId)
  const memberIsAdmin = !R.isNil(role) && role === 'ADMIN'
  
  if (!memberIsAdmin) { throw new Error('Action not authorized - lack of role permission.') }
  
  return true
}