import React from 'react'
import { connect } from 'formik'
import * as R from 'ramda'

/**
 * Usage:
 *  - Receive setFieldError from the Formik onSubmit's 2nd paramater
 *  - Parse the server errors using parseServerErrors in /client/utils/forms
 *  - Run setFieldError('form', parsedErrorMessage) on catch
 *  - IMPORTANT: make sure the field name for setFieldError is 'form' for this to work
 */

const FormErrorMessage = ({ formik, className }) => {
  const errors = formik.errors.form
  return (
    <div className={`f6 mt1 red ${className}`} style={{ display: R.isEmpty(errors) ? 'none' : 'block' }}>{errors}</div>
  )
}

export default connect(FormErrorMessage)