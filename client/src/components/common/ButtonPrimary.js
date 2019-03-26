import React from 'react'
import * as R from 'ramda'
import Button from 'antd/es/button'
import 'antd/es/button/style/css'

const ButtonPrimary = ({ children, type, style = {}, ...rest }) => (
  <Button
    type="primary" 
    htmlType={type} 
    size="large" 
    style={R.merge({}, style)}
    {...rest}
  >
    <span style={{ marginTop: '4px' }}>{children}</span>
  </Button>
)

export default ButtonPrimary