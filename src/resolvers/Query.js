import * as R from 'ramda'
import UserQuery from './UserQuery'
import FileQuery from './FileQuery'
import ProjectQuery from './ProjectQuery'
import MemberQuery from './MemberQuery'
import PostQuery from './PostQuery'
import CommentQuery from './CommentQuery'
import MilestoneQuery from './MilestoneQuery'
import SubscriberQuery from './SubscriberQuery'
import MailQuery from './MailQuery'

const Query = R.mergeAll([
  UserQuery,
  FileQuery,
  ProjectQuery,
  MemberQuery,
  PostQuery,
  CommentQuery,
  MilestoneQuery,
  SubscriberQuery,
  MailQuery,
])

export { Query as default }