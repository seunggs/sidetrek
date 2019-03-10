import React, { Fragment } from 'react'
import * as R from 'ramda'
import Select from 'react-select'
import { Field } from 'formik'
import Label from './Label'

/*
  Usage:
  <Select options={[1, 2, 3]} />
*/

const CustomSelectComponent = ({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors, setFieldValue, setFieldTouched }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {
  const errorClassName = 'f6 mt1 red'
  const { label, options } = props
  const { name } = field
  const fieldTouched = touched[name]
  const fieldErrors = errors[name]
  const finalFieldErrors = R.is(Object, fieldErrors) ?
    fieldErrors.map((error, i) => <div className={errorClassName} key={i}>{error}</div>) :
    <div className={errorClassName}>{fieldErrors}</div>

  return R.isEmpty(options) ? null : (
    <div className="mb3">
      <Label name={name}>{label}</Label>
      <Select
        {...field}
        onChange={value => {
          setFieldValue(name, value)
        }}
        onBlur={setFieldTouched}
        {...props}
        options={options}
      />
      {fieldTouched &&
        fieldErrors && <Fragment>{finalFieldErrors}</Fragment>}
    </div>
  )
}

const CustomSelectField = ({ ...rest }) => (
  <Field {...rest} component={CustomSelectComponent} />
)

export default CustomSelectField