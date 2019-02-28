import React, { Component } from 'react'
import { createPortal } from 'react-dom'
import * as R from 'ramda'
import Slider from '../common/Slider'
import Icon from '../common/Icon'
import { getRelativePosition, checkHasBlock } from './utils'

class ImageWidthPopover extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  formatter = value => {
    return `${value}%`
  }

  getPosition = (imageHoverMenuRect, sliderWidth) => {
    const { top, bottom, left } = getRelativePosition(imageHoverMenuRect)
    return {
      top: top - 1,
      bottom: bottom - 1,
      left: left + (imageHoverMenuRect.width / 2) - (sliderWidth / 2),
    }
  }

  render() {
    const { visible, editor, onAfterChange, close } = this.props
    const editorElem = window.document.getElementById('editor')
    const imageHoverMenu = window.document.getElementById('image-hover-menu')
    const imageHoverMenuRect = imageHoverMenu ? imageHoverMenu.getBoundingClientRect() : { top: 0, right: 0, bottom: 0, left: 0, width: 0 }
    const sliderWidth = 260
    const popoverPosition = this.getPosition(imageHoverMenuRect, sliderWidth)
    const baseStyle = R.merge({
      width: sliderWidth,
    }, popoverPosition)
    const hiddenStyle = R.merge(baseStyle, {
      zIndex: '-1',
      opacity: '0',
      transform: 'translateY(15%)',
    })
    const visibleStyle = R.merge(baseStyle, {
      zIndex: '5',
      opacity: '1',
      transform: 'translateY(0)',
    })
    const idToAttach = editorElem ? 'editor' : 'root'

    // If the selection doesn't include image and the popover is still visible, then hide it
    if (!checkHasBlock(editor.value, 'image') && visible) { close() }

    return createPortal(
      <div className="absolute br3 dib bg-white shadow-6 transition-in" style={visible ? visibleStyle : hiddenStyle}>
        <div className="flex items-center" style={{ height: '100%' }}>
          <div className="pb1 w-90"><Slider defaultValue={50} tipFormatter={this.formatter} onAfterChange={onAfterChange} tabIndex={-1} /></div>
          {/* <div className="pb1 w-90"></div> */}
          <div className="ph1 w-10 tc" onClick={close}><Icon className="o-60 glow pointer" type="close-circle" theme="filled" /></div>
        </div>
      </div>,
      window.document.getElementById(idToAttach)
    )
  }
}

export default ImageWidthPopover