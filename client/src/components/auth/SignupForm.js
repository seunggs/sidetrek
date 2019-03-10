import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Formik, Form } from 'formik'
import Field from '../common/Field'
import * as Yup from 'yup'
import { ApolloConsumer } from 'react-apollo'
import ButtonPrimary from '../common/ButtonPrimary'
import { startLogin, startSignup } from '../../actions/auth'
import { validateEmail } from '../../utils/validators'
import { parseServerErrors } from '../../utils/errors'
import FormErrorMessage from '../common/FormErrorMessage'

class SignupForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isValidatingEmail: false,
      emailAvailable: null,
      submitErrors: '',
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

  validateNameAndPassword = values => {
    return Yup
      .object()
      .shape({
        name: Yup
          .string()
          .required('Full name is required.'),
        password: Yup
          .string()
          .required('Password is required.')
          .min(8, 'Should be at least 8 characters.')
          .matches(/[a-zA-Z]+[^a-zA-Z\s]+/, 'Should contain a number or symbol.')
      })
      .validate(values, { abortEarly: false })
      .catch(err => {
        throw err.inner.reduce((errors, err) => {
          const prevErrorMsgs = errors[err.path] || []
          return {
            ...errors,
            [err.path]: prevErrorMsgs.concat(err.message)
          }
        }, {})
      })
  }

  render() {
    const { startLogin, startSignup } = this.props
    const CheckingAvailabilityMsg = ({ content = 'Checking availability...' }) => <span>{content}</span>

    return (
      <Fragment>
        <ApolloConsumer>
          {client => (
            <Formik
              initialValues={{
                name: '',
                email: '',
                password: '',
              }}
              validateOnChange={false}
              validate={this.validateNameAndPassword}
              onSubmit={async ({ name, email, password }, { setSubmitting, setFieldError }) => {
                console.log('submitted')
                try {
                  await startSignup(email, password, { name })
                  setSubmitting(false)
                  console.log('Sign up successful')

                  // Now login
                  await startLogin(email, password)
                  console.log('Login successful')
                } catch (errors) {
                  const errorMessage = parseServerErrors(errors)
                  setSubmitting(false)
                  setFieldError('form', errorMessage)
                }
              }}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form noValidate>
                  <div>
                    <Field
                      name="name"
                      placeholder="Full name"
                    />
                  </div>

                  <div>
                    <Field
                      type="email"
                      name="email"
                      placeholder="Email"
                      validate={email => this.validateEmail(email, client)}
                    />
                    <span>{this.state.isValidatingEmail ? <CheckingAvailabilityMsg /> : null}</span>
                    <span>{this.state.emailAvailable ? 'Email is available!' : null}</span>
                  </div>

                  <div>
                    <Field
                      type="password"
                      name="password"
                      placeholder="Password"
                    />
                  </div>

                  <div>
                    <ButtonPrimary type="submit" loading={isSubmitting}>Sign Up</ButtonPrimary>
                  </div>
                  <FormErrorMessage />
                </Form>
              )}
            </Formik>
          )}
        </ApolloConsumer>
      </Fragment>
    )
  }
}

export default connect(undefined, { startLogin, startSignup })(SignupForm)