import React, { Component, Fragment } from 'react'
import logger from '../utils/logger'
import { withRouter } from 'react-router-dom'
import * as Yup from 'yup'
import { withApollo } from 'react-apollo'
import { connect } from 'react-redux'
import EditableText from './common/EditableText'
import { startUpdateUser, startDeleteUser } from '../actions/user'
import { startLogout } from '../actions/auth'
import { validateUsername } from '../utils/validators'
import { parseServerErrors } from '../utils/errors'
import ButtonWarning from './common/ButtonWarning'

class SettingsPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isValidatingUsername: false,
      usernameAvailable: null,
      profile: {},
      isDeleting: false,
      deleteError: ''
    }
  }

  setValidatingUsername = value => {
    // Set loading status while async validating
    this.setState(() => ({ isValidatingUsername: value }))
  }

  validateUsername = (username, client) => {
    this.setState(() => ({ usernameAvailable: null }))
    return validateUsername({ username, client, setValidatingUsername: this.setValidatingUsername })
      .then(() => this.setState(() => ({ usernameAvailable: true })))
  }

  validatePassword = password => {
    return Yup
      .string()
      .required('Password is required.')
      .min(8, 'Should be at least 8 characters.')
      .matches(/[a-zA-Z]+[^a-zA-Z\s]+/, 'Should contain a number or symbol.')
      .isValidSync(password)
  }

  handleDeleteAccount = async () => {
    const { history, client, user, startDeleteUser, startLogout } = this.props
    this.setState(() => ({ isDeleting: true }))
    try {
      // throw new Error('Cannot delete!')
      await startDeleteUser(client, user.email)
      await startLogout(history, client)

      // Send notification for successful account deletion

      setTimeout(() => {
        history.replace('/')
        return
      }, 2000)
    } catch (errors) {
      const errorMessage = parseServerErrors(errors)
      logger(errorMessage)
      this.setState(() => ({ deleteError: errorMessage }))
    }
    this.setState(() => ({ isDeleting: false }))
  }

  render() {
    const { client, user, startUpdateUser } = this.props
    const { email, username, hasPassword } = user
    const { isDeleting, deleteError } = this.state
    const isEditable = true

    const CheckingAvailabilityMsg = ({ content = 'Checking availability...' }) => <span>{content}</span>

    return (
      <Fragment>
        <div>Settings</div>
        <div>
          <EditableText
            isEditable={isEditable}
            name="username"
            validate={newUsername => this.validateUsername(newUsername, client)}
            onSubmit={async ({ username: newUsername }, { setSubmitting, setFieldError }) => {
              try {
                await startUpdateUser(client, email, { username: newUsername })
                logger('Username successfully updated')
                setSubmitting(false)
              } catch (errors) {
                const errorMessage = parseServerErrors(errors)
                logger('Updating username failed')
                setSubmitting(false)
                this.setState(() => ({ usernameAvailable: null }))
                setFieldError('username', errorMessage)
              }
            }}
          >{username}
          </EditableText>
          <span>{this.state.isValidatingUsername ? <CheckingAvailabilityMsg /> : ''}</span>
          <span>{this.state.usernameAvailable ? 'Username is available!' : null}</span>
        </div>

        <div>
          {hasPassword && <EditableText
            isEditable={isEditable}
            name="password"
            type="password"
            validate={this.validatePassword}
            onSubmit={async ({ password: newPassword }, { setSubmitting, setFieldError }) => {
              try {
                await startUpdateUser(client, email, { password: newPassword })
                logger('Password successfully updated')
                setSubmitting(false)
              } catch (errors) {
                const errorMessage = parseServerErrors(errors)
                logger('Updating password failed')
                setSubmitting(false)
                setFieldError('password', errorMessage)
              }
            }}
          >{<span className="gray">********</span>}
          </EditableText>}
        </div>

        <div>
          <div>
            <ButtonWarning onClick={this.handleDeleteAccount} disabled={isDeleting}>Delete Account</ButtonWarning>
            {isDeleting && <span>Deleting the account...</span>}
          </div>
          {deleteError}
        </div>
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user
})

export default withRouter(withApollo(connect(mapStateToProps, { startUpdateUser, startDeleteUser, startLogout })(SettingsPage)))