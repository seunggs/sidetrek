import React from 'react'
import isHotkey from 'is-hotkey'

const createHotkeyPlugin = options => {
  const { hotkey, type } = options

  return {
    renderMark(props, editor, next) {
      const { children, mark, attributes} = props
      switch (mark.type) {
        case 'bold':
          return <strong {...attributes}>{children}</strong>
        case 'italic':
          return <i {...attributes}>{children}</i>
        case 'underline':
          return <u {...attributes}>{children}</u>
        case 'code':
          return <code className="pa2 bg-near-white br3" {...attributes}>{children}</code>
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