import React from 'react'
import Icon from 'antd/es/icon'

const MyIcon = ({ theme = 'outlined', ...rest }) => (
  <Icon theme={theme} {...rest} />
)

export default MyIcon