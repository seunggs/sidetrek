import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import logger from '../../utils/logger'
import ButtonPrimary from '../common/ButtonPrimary'
import { startLogin } from '../../actions/auth'
import { parseServerErrors } from '../../utils/errors'
import FormErrorMessage from '../common/FormErrorMessage'

const LoginSchema = Yup
  .object()
  .shape({
    email: Yup
      .string()
      .email('Email is not valid')
      .required('Email is required'),
    password: Yup
      .string()
      .required('Password is required')
  })

class LoginForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      submitError: ''
    }
  }

  render() {
    const { startLogin } = this.props
    return (
      <div>
        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validationSchema={LoginSchema}
          validateOnChange={false}
          onSubmit={async ({ email, password }, { setSubmitting, setFieldError }) => {
            try {
              await startLogin(email, password)
              setSubmitting(false)
              logger('Login successful')
            } catch (errors) {
              logger('Login failed')
              const errorMessage = parseServerErrors(errors)
              setSubmitting(false)
              setFieldError('form', errorMessage)
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <div>
                <Field type="email" name="email" placeholder="Email" />
              </div>
              <ErrorMessage name="email" component="div" />

              <div>
                <Field type="password" name="password" placeholder="Password" />
              </div>
              <ErrorMessage name="password" component="div" />

              <div>
                <ButtonPrimary type="submit" disabled={isSubmitting}>Login</ButtonPrimary>
              </div>
              <FormErrorMessage />
            </Form>
          )}
        </Formik>
      </div>
    )
  }
}

export default connect(undefined, { startLogin })(LoginForm)