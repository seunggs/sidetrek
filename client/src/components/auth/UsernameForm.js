import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { ApolloConsumer } from 'react-apollo'
import logger from '../../utils/logger'
import ButtonPrimary from '../common/ButtonPrimary'
import { validateUsername } from '../../utils/validators'
import { startUpdateUser } from '../../actions/user'
import { parseServerErrors } from '../../utils/errors'
import FormErrorMessage from '../common/FormErrorMessage'
import debounce from 'lodash.debounce'

class UsernameForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isValidatingUsername: false,
      usernameAvailable: null,
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
  debouncedValidateUsername = debounce(this.validateUsername, 500)

  componentDidMount() {
    const { user, history } = this.props
    if (user.username) {
      history.replace('/')
    }
  }

  render() {
    const { user, startUpdateUser, history } = this.props
    const { email } = user
    const CheckingAvailabilityMsg = ({ content = 'Checking availability...' }) => <span>{content}</span>
    return (
      <div>
        <ApolloConsumer>
          {client => (
            <Formik
              initialValues={{
                username: '',
              }}
              onSubmit={async ({ username: newUsername }, { setSubmitting, setFieldError }) => {
                try {
                  await startUpdateUser(client, email, { username: newUsername })
                  setSubmitting(false)
                  logger('Adding username successful')
                  history.push(`/profile/${newUsername}`)
                } catch (errors) {
                  logger('Adding username failed')
                  const errorMessage = parseServerErrors(errors)
                  setSubmitting(false)
                  setFieldError('form', errorMessage)
                }
              }}
            >
              {({ isSubmitting }) => (
                <Form noValidate>
                  <div>
                    <Field
                      name="username"
                      placeholder="Username"
                      validate={newUsername => this.debouncedValidateUsername(newUsername, client)}
                    />
                    <span>{this.state.isValidatingUsername ? <CheckingAvailabilityMsg /> : ''}</span>
                    <span>{this.state.usernameAvailable ? 'Username is available!' : null}</span>
                  </div>
                  <ErrorMessage name="username" component="div" />

                  <div>
                    <ButtonPrimary type="submit" disabled={isSubmitting}>Next</ButtonPrimary>
                  </div>
                  <FormErrorMessage />
                </Form>
              )}
            </Formik>
          )}
        </ApolloConsumer>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user
})

export default withRouter(connect(mapStateToProps, { startUpdateUser })(UsernameForm))