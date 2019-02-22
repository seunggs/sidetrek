import React from 'react'
import { createPortal } from 'react-dom'
import * as R from 'ramda'
import data from 'emoji-mart/data/messenger.json'
import { NimblePicker } from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'

const EmojiMenu = ({ visible = false, ...rest }) => {
  const baseStyle = {
    position: 'absolute',
    transition: 'all 0.15s cubic-bezier(.92,.23,.82,1.61)',
    transitionProperty: 'opacity, transform, visibility',
    top: '25px',
    right: '0',    
  }
  const visibleStyle = R.merge(baseStyle, {
    zIndex: '1',
    opacity: '1',
    transform: 'translateY(0)',
    visibility: 'visible',
  })
  const hiddenStyle = R.merge(baseStyle, {
    zIndex: '-1',
    opacity: '0',
    transform: 'translateY(5%)',
    visibility: 'hidden',
  })
  const emojiBlockButtonElem = window.document.getElementById('emoji-block-button')
  const idToAttachPortal = emojiBlockButtonElem ? 'emoji-block-button' : 'root'
  return createPortal(
    <NimblePicker
      set="messenger"
      data={data}
      emojiSize={20}
      // emoji="point_up"
      // title="Pick an emoji!"
      showPreview={false}
      className="absolute transition-in"
      style={visible ? visibleStyle : hiddenStyle}
      {...rest}
    />,
    window.document.getElementById(idToAttachPortal)
  )
}

export default EmojiMenu
