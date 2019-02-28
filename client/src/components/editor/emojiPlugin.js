import isHotkey from 'is-hotkey'
import getRenderElement from './getRenderElement'

export const checkIsEscapeHotkey = isHotkey('esc')

const emojiPlugin = (options) => {
  return {
    renderNode(props, editor, next) {
      const { node, attributes } = props

      switch (node.type) {
        case 'emoji':
          return getRenderElement({ type: node.type, attributes, data: node.data })
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