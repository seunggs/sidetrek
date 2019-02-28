import * as R from 'ramda'
import UserQuery from './UserQuery'
import FileQuery from './FileQuery'
import ProjectQuery from './ProjectQuery'
import MemberQuery from './MemberQuery'
import PostQuery from './PostQuery'
import CommentQuery from './CommentQuery'
import MilestoneQuery from './MilestoneQuery'

const Query = R.mergeAll([
  UserQuery,
  FileQuery,
  ProjectQuery,
  MemberQuery,
  PostQuery,
  CommentQuery,
  MilestoneQuery,
])

export { Query as default }