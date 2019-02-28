import isHotkey from 'is-hotkey'
import getRenderElement from './getRenderElement'

const createHotkeyPlugin = options => {
  const { hotkey, type } = options

  return {
    renderMark(props, editor, next) {
      const { children, mark, attributes} = props
      switch (mark.type) {
        case 'bold':
          return getRenderElement({ type: mark.type, children, attributes })
        case 'italic':
          return getRenderElement({ type: mark.type, children, attributes })
        case 'underline':
          return getRenderElement({ type: mark.type, children, attributes })
        case 'code':
          return getRenderElement({ type: mark.type, children, attributes })
        default:
          return next()
      }
    },
    onKeyDown(event, editor, next) {
      if (!isHotkey(hotkey, event)) { return next() }

      event.preventDefault()

      editor.toggleMark(type)
      return next()
    }
  }
}

export const boldPlugin = createHotkeyPlugin({ hotkey: 'mod+b', type: 'bold' })
export const italicPlugin = createHotkeyPlugin({ hotkey: 'mod+i', type: 'italic' })
export const underlinePlugin = createHotkeyPlugin({ hotkey: 'mod+u', type: 'underline' })
export const codePlugin = createHotkeyPlugin({ hotkey: 'mod+p', type: 'code' })