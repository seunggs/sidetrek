import * as R from 'ramda'
import UserMutation from './UserMutation'
import FileMutation from './FileMutation'
import ProjectMutation from './ProjectMutation'
import MemberMutation from './MemberMutation'
import PostMutation from './MemberMutation'
import CommentMutation from './CommentMutation'
import MilestoneMutation from './MilestoneMutation'

const Mutation = R.mergeAll([
  UserMutation,
  FileMutation,
  ProjectMutation,
  MemberMutation,
  PostMutation,
  CommentMutation,
  MilestoneMutation,
])

export { Mutation as default }