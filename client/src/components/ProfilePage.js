import React, { Component, Fragment } from 'react'
import logger from '../utils/logger'
import * as moment from 'moment'
import { withRouter } from 'react-router-dom'
import * as Yup from 'yup'
import { withApollo } from 'react-apollo'
import { connect } from 'react-redux'
import EditableText from './common/EditableText'
import { GET_USER_OP } from '../operations/user'
import { startUpdateUser } from '../actions/user'
import { validateEmail } from '../utils/validators'
import { parseServerErrors } from '../utils/errors'
import ProfilePicture from './common/ProfilePicture'

class ProfilePage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isValidatingEmail: false,
      emailAvailable: null,
      profileExists: null,
      profile: {},
    }
  }

  setValidatingEmail = value => {
    // Set loading status while async validating
    this.setState(() => ({ isValidatingEmail: value }))
  }
  validateEmail = (email, client) => {
    this.setState(() => ({ emailAvailable: null }))
    return validateEmail({ email, client, setValidatingEmail: this.setValidatingEmail })
      .then(() => this.setState(() => ({ emailAvailable: true })))
  }

  validateName = name => {
    return Yup.string().required('Full name is required.').isValidSync(name)
  }

  validateTwitter = twitter => {
    return Yup.string().required('Valid Twitter handle is required.').isValidSync(twitter)
  }

  componentDidMount() {
    const { match, client } = this.props
    const { username } = match.params

    client.query({
      query: GET_USER_OP,
      variables: { where: { username } }
    }).then(({ data }) => {
      const profile = data.user

      if (profile === null) {
        this.setState(() => ({ profileExists: false }))
      } else {
        this.setState(() => ({ profile, profileExists: true }))
      }
    }).catch(err => logger.error(err))
  }

  render() {
    // 'user' in Redux state is the authenticated user ('authedUser')
    // 'user' we're fetching is from the DB based on route params ('displayedUser'; stored as 'profile' in local state)
    const { match, client, user: authedUser, startUpdateUser } = this.props
    const displayedUser = match.params
    const viewingOwnProfile = displayedUser.username === authedUser.username
    const { profileExists } = this.state
    const isEditable = viewingOwnProfile
    const profile = viewingOwnProfile ? authedUser : this.state.profile
    logger.info(`profile${viewingOwnProfile ? ' (own)' : ''}`)
    const { email, name, username, twitter, picture, createdAt, hasPassword, hasSocialLogin } = profile

    const CheckingAvailabilityMsg = ({ content = 'Checking availability...' }) => <span>{content}</span>

    return (
      <Fragment>
        {profileExists ? (
          <Fragment>
            <div>Profile</div>
            <div><ProfilePicture isEditable={isEditable} srcURL={picture} /></div>
            <div>{username}</div>
            <div>Joined {moment(createdAt).format('MMMM YYYY')}</div>
            <div>
              <EditableText
                isEditable={hasPassword && !hasSocialLogin && isEditable}
                name="email"
                validate={newEmail => this.validateEmail(newEmail, client)}
                onSubmit={async ({ email: newEmail }, { setSubmitting, setFieldError }) => {
                  try {
                    await startUpdateUser(client, email, { email: newEmail })
                    logger.info('Email successfully updated')
                    setSubmitting(false)
                  } catch (errors) {
                    const errorMessage = parseServerErrors(errors)
                    logger.error('Updating email failed')
                    logger.error(errorMessage)
                    setSubmitting(false)
                    this.setState(() => ({ emailAvailable: null }))
                    setFieldError('email', errorMessage)
                  }
                }}
              >{email}
              </EditableText>
              <span>{this.state.isValidatingEmail ? <CheckingAvailabilityMsg /> : ''}</span>
              <span>{this.state.emailAvailable ? 'Email is available!' : null}</span>
            </div>

            <div>
              <EditableText
                isEditable={isEditable}
                name="name"
                validate={this.validateName}
                onSubmit={async ({ name: newName }, { setSubmitting, setFieldError }) => {
                  try {
                    await startUpdateUser(client, email, { name: newName })
                    logger.info('Name successfully updated')
                    setSubmitting(false)
                  } catch (errors) {
                    const errorMessage = parseServerErrors(errors)
                    logger.error('Updating name failed')
                    setSubmitting(false)
                    setFieldError('name', errorMessage)
                  }
                }}
              >{name}
              </EditableText>
            </div>

            <div>
              <EditableText
                isEditable={isEditable}
                name="twitter"
                validate={this.validateTwitter}
                onSubmit={async ({ twitter: newTwitter }, { setSubmitting, setFieldError }) => {
                  try {
                    await startUpdateUser(client, email, { twitter: newTwitter })
                    logger.info('Twitter handle successfully updated')
                    setSubmitting(false)
                  } catch (errors) {
                    const errorMessage = parseServerErrors(errors)
                    logger.error('Updating Twitter handle failed')
                    setSubmitting(false)
                    setFieldError('twitter', errorMessage)
                  }
                }}
              >{!twitter ? <span className="gray">Add Twitter handle here</span> : twitter}
              </EditableText>
            </div>
          </Fragment>
        ) : (
          <div>This user doesn't exist</div>
        )}
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user
})

export default withRouter(withApollo(connect(mapStateToProps, { startUpdateUser })(ProfilePage)))