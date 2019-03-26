import React, { Fragment } from 'react'
import * as R from 'ramda'
import DatePicker from 'antd/es/date-picker'
import 'antd/es/date-picker/style/css'
import { Field } from 'formik'
import Label from './Label'

const MyDatePickerComponent = ({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors, setFieldValue, setFieldTouched }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {
  const { label } = props
  const { name } = field
  const dateFormat = 'YYYY/MM/DD'
  const errorClassName = 'f6 mt1 red'
  const fieldTouched = touched[name]
  const fieldErrors = errors[name]
  const finalFieldErrors = R.is(Object, fieldErrors) ?
    fieldErrors.map((error, i) => <div className={errorClassName} key={i}>{error}</div>) :
    <div className={errorClassName}>{fieldErrors}</div>
  return (
    <div className="mb3">
      <Label name={name}>{label}</Label>
      <DatePicker 
        size="large" 
        format={dateFormat}
        {...field}
        onChange={value => {
          setFieldValue(name, value)
        }}
        onBlur={setFieldTouched}
        {...props}
      />
      { fieldTouched &&
        fieldErrors && <Fragment>{finalFieldErrors}</Fragment>}
    </div>
  )
}

const MyField = ({ ...rest }) => (
  <Field {...rest} component={MyDatePickerComponent} />
)

export default MyField