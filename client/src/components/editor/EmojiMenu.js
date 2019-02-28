import React from 'react'
import { createPortal } from 'react-dom'
import * as R from 'ramda'
import data from 'emoji-mart/data/messenger.json'
import { NimblePicker } from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'
import { getRelativePosition } from './utils'

const EmojiMenu = ({ visible = false, editor, ...rest }) => {
  const emojiBlockButtonElem = window.document.getElementById('emoji-block-button')
  const emojiBlockButtonRect = emojiBlockButtonElem ?
    emojiBlockButtonElem.getBoundingClientRect() :
    { top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 }

  const emojiBlockButtonRelativePosition = getRelativePosition(emojiBlockButtonRect)
  const editorElem = window.document.getElementById('editor')
  const idToAttachPortal = editorElem ? 'editor' : 'root'

  const baseStyle = {
    position: 'absolute',
    transition: 'all 0.15s cubic-bezier(.92,.23,.82,1.61)',
    transitionProperty: 'opacity, transform, visibility',
    top: emojiBlockButtonRelativePosition.top + 25,
    right: emojiBlockButtonRelativePosition.right,
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

  return createPortal(
    <div className="absolute" style={visible ? visibleStyle : hiddenStyle}>
      <NimblePicker
        set="messenger"
        data={data}
        emojiSize={20}
        // emoji="point_up"
        // title="Pick an emoji!"
        showPreview={false}
        className="absolute transition-in"
        {...rest}
      />
    </div>,
    window.document.getElementById(idToAttachPortal)
  )
}

export default EmojiMenu
