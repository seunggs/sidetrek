import React from 'react'
import Checkbox from 'antd/es/checkbox'
import 'antd/es/checkbox/style/css'
import { Field } from 'formik'

/*
  Usage:
  <Checkbox name="attribute1" label="Size" />
*/

const MyCheckboxComponent = ({
  field, // { name, value, onChange, onBlur }
  form: { setFieldValue }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {
  const { label } = props
  const { name, value } = field
  return (
    <div className="mb3">
      <Checkbox
        {...field}
        value={value}
        checked={value}
        onChange={e => {
          setFieldValue(name, e.target.checked)
        }}
        {...props}
      >
        {label}
      </Checkbox>
    </div>
  )
}

const MyCheckbox = ({ ...rest }) => (
  <Field {...rest} component={MyCheckboxComponent} />
)

export default MyCheckbox