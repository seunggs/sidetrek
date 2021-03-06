import React from 'react'
import * as R from 'ramda'
import Button from 'antd/es/button'
import 'antd/es/button/style/css'

const ButtonWarning = ({ children, type, style = {}, ...rest }) => (
  <Button
    type="danger"
    htmlType={type}
    style={R.merge({}, style)}
    {...rest}
  >
    <span>{children}</span>
  </Button>
)

export default ButtonWarning