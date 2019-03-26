import React from 'react'
import * as R from 'ramda'
import Button from 'antd/es/button'
import 'antd/es/button/style/css'

const ButtonGoogleLogin = ({ children, style = {}, type, ...rest }) => (
  <Button
    type="primary"
    htmlType={type}
    size="large"
    icon="google"
    style={R.merge({ backgroundColor: '#FF725C', borderColor: '#FF725C' }, style)}
    {...rest}
  ><span style={{ marginTop: '4px' }}>{children}</span></Button>
)

export default ButtonGoogleLogin