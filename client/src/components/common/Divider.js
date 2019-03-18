import React from 'react'
import * as R from 'ramda'
import Divider from 'antd/es/divider'
import 'antd/es/divider/style/css'

const MyDivider = ({ style, ...rest }) => (
  <Divider style={R.merge({}, style)} {...rest} />
)

export default MyDivider