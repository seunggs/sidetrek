import React from 'react'
import Icon from './Icon'

const CheckFieldAvailability = ({ fieldName, validatingField, fieldAvailable }) => {
  const messageClassName = 'f6 mt1 green'
  return (
    <div style={{ marginTop: validatingField || fieldAvailable ? '-1rem' : '', marginBottom: '1rem' }}>
      {validatingField ? <span className={messageClassName}><Icon type="loading" className="mr2" />Checking availability...</span> : null}
      {fieldAvailable ? <span className={messageClassName}><Icon type="check" className="mr2" />{fieldName} is available!</span> : null}
    </div>
  )
}

export default CheckFieldAvailability