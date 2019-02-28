import React from 'react'
import * as R from 'ramda'
import Slider from 'antd/es/slider'
import 'antd/es/slider/style/css'

const CustomSlider = ({ style, ...rest }) => (
  <Slider style={R.merge({}, style)} {...rest} />
)

export default CustomSlider