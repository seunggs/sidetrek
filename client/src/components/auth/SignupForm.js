import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { ApolloConsumer } from 'react-apollo'
import logger from '../../utils/logger'
import ButtonPrimary from '../common/ButtonPrimary'
import { startLogin, startSignup } from '../../actions/auth'
import { validateEmail } from '../../utils/validators'
import { parseServerErrors } from '../../utils/errors'
import FormErrorMessage from '../common/FormErrorMessage'
import debounce from 'lodash.debounce'

class SignupForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // formValues: {},
      isValidatingEmail: false,
      emailAvailable: null,
      submitErrors: '',
    }
  }

  // checkFieldUpdating = (newField, newValue) => {
  //   // NOTE: This is a workaround for Formik running field level validation on blur of every field in the form 
  //   // Only run field level validation on blur of the selected field
  //   const oldValue = this.state.formValues[newField]
  //   const isFieldUpdating = oldValue !== newValue
  //   if (isFieldUpdating) { this.setState(() => ({ formValues: R.merge(this.state.formValues, { [newField]: newValue }) })) }
  //   return isFieldUpdating
  // }

  setValidatingEmail = value => {
    // Set loading status while async validating
    this.setState(() => ({ isValidatingEmail: value }))
  }
  validateEmail = (email, client) => {
    this.setState(() => ({ emailAvailable: null }))
    return validateEmail({ email, client, setValidatingEmail: this.setValidatingEmail })
      .then(() => this.setState(() => ({ emailAvailable: true })))
  }
  debouncedValidateEmail = debounce(this.validateEmail, 500)
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
      <div>
        <ApolloConsumer>
          {client => (
            <Formik
              initialValues={{
                name: '',
                email: '',
                password: '',
              }}
              validate={this.validateNameAndPassword}
              onSubmit={async ({ name, email, password }, { setSubmitting, setFieldError }) => {
                logger('submitted')
                try {
                  await startSignup(email, password, { name })
                  setSubmitting(false)
                  logger('Sign up successful')

                  // Now login
                  await startLogin(email, password)
                  logger('Login successful')
                } catch (errors) {
                  logger('Sign up failed')
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
                  <ErrorMessage name="name" component="div" />

                  <div>
                    <Field
                      type="email"
                      name="email"
                      placeholder="Email"
                      validate={email => this.debouncedValidateEmail(email, client)}
                    />
                    <span>{this.state.isValidatingEmail ? <CheckingAvailabilityMsg /> : null}</span>
                    <span>{this.state.emailAvailable ? 'Email is available!' : null}</span>
                  </div>
                  <ErrorMessage name="email" component="div" />

                  <div>
                    <Field
                      type="password"
                      name="password"
                      placeholder="Password"
                    />
                  </div>
                  <ErrorMessage name="password">{errors => errors.map((err, i) => <div key={i}>{err}</div>)}</ErrorMessage>

                  <div>
                    <ButtonPrimary type="submit" disabled={isSubmitting}>Sign Up</ButtonPrimary>
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

export default connect(undefined, { startLogin, startSignup })(SignupForm)