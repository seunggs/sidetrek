import React from 'react'
import * as R from 'ramda'
import Slider from 'antd/es/slider'
import 'antd/es/slider/style/css'

const MySlider = ({ style, ...rest }) => (
  <Slider style={R.merge({}, style)} {...rest} />
)

export default MySlider