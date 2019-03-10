import React, { Fragment } from 'react'
import * as R from 'ramda'
import Input from 'antd/es/input'
import 'antd/es/input/style/css'
import { Field } from 'formik'
import Label from './Label'

const CustomInputComponent = ({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {
  const { label } = props
  const { name } = field
  const errorClassName = 'f6 mt1 red'
  const fieldTouched = touched[name]
  const fieldErrors = errors[name]
  const finalFieldErrors = R.is(Object, fieldErrors) ?
    fieldErrors.map((error, i) => <div className={errorClassName} key={i}>{error}</div>) :
    <div className={errorClassName}>{fieldErrors}</div>
  return (
    <div className="mb3">
      <Label name={name}>{label}</Label>
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