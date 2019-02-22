import * as R from 'ramda'
import UserMutation from './UserMutation'
import FileMutation from './FileMutation'
import ProjectMutation from './ProjectMutation'
import MemberMutation from './MemberMutation'

const Mutation = R.mergeAll([
  UserMutation,
  FileMutation,
  ProjectMutation,
  MemberMutation,
])

export { Mutation as default }