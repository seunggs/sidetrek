import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import * as R from 'ramda'
import Button1 from '../common/Button1'
import { startLogin, startSignup } from '../../actions/auth'

const SignupSchema = Yup
  .object()
  .shape({
    name: Yup
      .string()
      .min(2, 'At least 2 characters')
      .required('Full name is required'),
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

class SignupForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      submitError: ''
    }
  }

  render() {
    const { startLogin, startSignup } = this.props
    return (
      <div>
        <Formik
          initialValues={{
            name: '',
            email: '',
            password: '',
          }}
          validationSchema={SignupSchema}
          onSubmit={async ({ name, email, password }, { setSubmitting }) => {
            console.log('submitted')
            try {
              await startSignup(email, password, { name })
              setSubmitting(false)
              console.log('Sign up successful')
  
              // Now login
              await startLogin(email, password)
              console.log('Login successful')
            } catch (err) {
              console.log('Sign up failed')
              console.log(err)
              setSubmitting(false)
              this.setState(() => ({ submitError: err.error_description }))
              setTimeout(() => this.setState(() => ({ submitError: '' })), 3000)
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <div><Field type="name" name="name" placeholder="Full name" /></div>
              <ErrorMessage name="name" component="div" />
              <div><Field type="email" name="email" placeholder="Email" /></div>
              <ErrorMessage name="email" component="div" />
              <div><Field type="password" name="password" placeholder="Password" /></div>
              <ErrorMessage name="password" component="div" />
              <div>
                <Button1 type="submit" disabled={isSubmitting}>
                  Sign Up
                </Button1>
              </div>
              <div style={{ display: R.isEmpty(this.state.submitError) ? 'none' : 'block' }}>{this.state.submitError}</div>
              <div>{this.state.submitError}</div>
            </Form>
          )}
        </Formik>
      </div>
    )
  }
}

export default connect(undefined, { startLogin, startSignup })(SignupForm)