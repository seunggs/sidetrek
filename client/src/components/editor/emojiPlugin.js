import React from 'react'
import isHotkey from 'is-hotkey'
import Emoji from '../common/Emoji'
import { checkHasBlock } from './utils';

export const checkIsEscapeHotkey = isHotkey('esc')

const emojiPlugin = (options) => {
  const { type } = options

  return {
    renderNode(props, editor, next) {
      const { children, node, attributes } = props

      switch (node.type) {
        case 'emoji':
          return (
            <Emoji className="dib relative" style={{ transform: 'scale(1.5)', marginLeft: '6px', marginRight: '2px' }} {...attributes}>
              {node.data.get('emoji').native}
            </Emoji>
          )
        default:
          return next()
      }
    },
    onKeyDown(event, editor, next) {
      return next()
    },
  }
}

export default emojiPlugin