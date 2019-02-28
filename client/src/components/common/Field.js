import React, { Fragment } from 'react'
import * as R from 'ramda'
import Input from 'antd/es/input'
import 'antd/es/input/style/css'
import { Field } from 'formik'

const CustomInputComponent = ({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {
  const errorClassName = 'f6 mt1 red'
  const fieldTouched = touched[field.name]
  const fieldErrors = errors[field.name]
  const finalFieldErrors = R.is(Object, fieldErrors) ?
    fieldErrors.map((error, i) => <div className={errorClassName} key={i}>{error}</div>) :
    <div className={errorClassName}>{fieldErrors}</div>
  return (
    <div className="mv3">
      <Input allowClear {...field} {...props} />
      { fieldTouched &&
        fieldErrors && <Fragment>{finalFieldErrors}</Fragment>}
    </div>
  )
}

const CustomField = ({ ...rest }) => (
  <Field {...rest} component={CustomInputComponent} />
)

export default CustomField