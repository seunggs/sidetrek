import React from 'react'
import * as R from 'ramda'
import Button from 'antd/es/button'
import 'antd/es/button/style/css'

const ButtonSecondary = ({ children, type, icon, style = {}, ...rest }) => (
  <Button
    type="primary"
    icon={icon}
    size="large"
    htmlType={type}
    className="ant-btn-xlg"
    style={R.merge({}, style)}
    {...rest}
  >
    <span>{children}</span>
  </Button>
)

export default ButtonSecondary