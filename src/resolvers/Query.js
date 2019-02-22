import * as R from 'ramda'
import UserQuery from './UserQuery'
import FileQuery from './FileQuery'
import ProjectQuery from './ProjectQuery'
import MemberQuery from './MemberQuery'

const Query = R.mergeAll([
  UserQuery,
  FileQuery,
  ProjectQuery,
  MemberQuery,
])

export { Query as default }