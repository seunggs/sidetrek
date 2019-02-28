import React from 'react'
import * as R from 'ramda'
import Button from 'antd/es/button'
import 'antd/es/button/style/css'

const ButtonGoogleLogin = ({ children, style = {}, type, ...rest }) => (
  <Button type="primary" htmlType={type} style={R.merge({ backgroundColor: '#FF725C', borderColor: '#FF725C' }, style)} {...rest}>{children}</Button>
)

export default ButtonGoogleLogin