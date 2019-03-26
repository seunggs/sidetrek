import * as R from 'ramda'
import UserMutation from './UserMutation'
import FileMutation from './FileMutation'
import ProjectMutation from './ProjectMutation'
import MemberMutation from './MemberMutation'
import PostMutation from './MemberMutation'
import CommentMutation from './CommentMutation'
import MilestoneMutation from './MilestoneMutation'
import SubscriberMutation from './SubscriberMutation'
import MailMutation from './MailMutation'

const Mutation = R.mergeAll([
  UserMutation,
  FileMutation,
  ProjectMutation,
  MemberMutation,
  PostMutation,
  CommentMutation,
  MilestoneMutation,
  SubscriberMutation,
  MailMutation,
])

export { Mutation as default }