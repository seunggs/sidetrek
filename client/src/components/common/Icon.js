import React from 'react'
import Icon from 'antd/es/icon'

const CustomIcon = ({ theme = 'outlined', ...rest }) => (
  <Icon theme={theme} {...rest} />
)

export default CustomIcon