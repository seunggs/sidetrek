import React from 'react'
import Popover from 'antd/es/popover'
import 'antd/es/popover/style/css'

const MyPopover = ({ children, ...rest }) => (
  <Popover {...rest}>
    {children}
  </Popover>
)

export default MyPopover