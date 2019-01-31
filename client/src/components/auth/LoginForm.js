import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import * as R from 'ramda'
import Button1 from '../common/Button1'
import { startLogin } from '../../actions/auth';

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
      .min(8, 'At least 8 characters')
      .matches(/[a-zA-Z]+[^a-zA-Z\s]+/, 'Contains a number or symbol')
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
          onSubmit={async ({ email, password }, { setSubmitting }) => {
            try {
              await startLogin(email, password)
              setSubmitting(false)
              console.log('Login successful')
            } catch (err) {
              console.log('Login failed')
              console.log(err)
              setSubmitting(false)
              this.setState(() => ({ submitError: err.error_description }))
              setTimeout(() => this.setState(() => ({ submitError: '' })), 3000)
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <div><Field type="email" name="email" placeholder="Email" /></div>
              <ErrorMessage name="email" component="div" />
              <div><Field type="password" name="password" placeholder="Password" /></div>
              <ErrorMessage name="password" component="div" />
              <div>
                <Button1 type="submit" disabled={isSubmitting}>
                  Login
              </Button1>
              </div>
              <div style={{ display: R.isEmpty(this.state.submitError) ? 'none' : 'block' }}>{this.state.submitError}</div>
            </Form>
          )}
        </Formik>
      </div>
    )
  }
}

export default connect(undefined, { startLogin })(LoginForm)