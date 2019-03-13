import React from 'react'
import * as R from 'ramda'
import Button from 'antd/es/button'
import 'antd/es/button/style/css'

const ButtonOutline = ({ children, type, style = {}, ...rest }) => (
  <Button type="outline" htmlType={type} style={R.merge({ fontWeight: '500' }, style)} {...rest}>{children}</Button>
)

export default ButtonOutline