import React from 'react'
import * as R from 'ramda'
import Timeline from 'antd/es/timeline'
import 'antd/es/timeline/style/css'

const MyTimeline = ({ style, children, ...rest }) => (
  <Timeline style={R.merge({}, style)} {...rest}>
    {children.map((child, i) => {
      return (
        <Timeline.Item key={i}>{child}</Timeline.Item>
      )
    })}
  </Timeline>
)

export default MyTimeline