import React from 'react'
import isHotkey from 'is-hotkey'
import { checkHasBlock } from './utils'
import { handleSetList } from './listPlugins'
import { DEFAULT_NODE, DEFAULT_IMAGE_WIDTH } from '../../utils/constants'

export const checkIsBackspaceHotkey = isHotkey('backspace')

export const checkIsReturnHotkey = isHotkey('return')

export const checkIsTabHotkey = isHotkey('tab')

export const checkIsUntabHotkey = isHotkey('shift+tab')

export const checkIsUpHotkey = isHotkey('up')

export const checkIsDownHotkey = isHotkey('down')

// Handles setting any block including lists
export function handleSetBlock(event, editor, type) {
  event.preventDefault()

  const { value } = editor
  
  if (type === 'unordered-list' || type === 'ordered-list') {
    // Handle the list
    handleSetList(editor, type)
  } else if (type === 'image') {
    // Handle image
    const src = ''
    editor.insertImage(editor, src, DEFAULT_IMAGE_WIDTH)
  } else {
    // Handle everything but list buttons
    const isActive = checkHasBlock(value, type)
    editor.setBlocks(isActive ? DEFAULT_NODE : type)
  }
}

function createBlockPlugin(options) {
  const { hotkey, type } = options

  return {
    renderNode(props, editor, next) {
      const { children, node, attributes } = props
      
      switch (node.type) {
        case 'block-quote':
          return <blockquote {...attributes}>{children}</blockquote>
        case 'heading-one':
          return <h1 className="f1 fw5" {...attributes}>{children}</h1>
        case 'heading-two':
          return <h2 className="f2 fw5" {...attributes}>{children}</h2>
        case 'align-left':
          return <div className="tl" {...attributes}>{children}</div>
        case 'align-center':
          return <div className="tc" {...attributes}>{children}</div>
        case 'align-right':
          return <div className="tr" {...attributes}>{children}</div>
        default:
          return next()
      }
    },
    onKeyDown(event, editor, next) {
      if (!hotkey || !isHotkey(hotkey, event)) { return next() }

      handleSetBlock(event, editor, type)
      return next()
    },
  }
}

export const headingOnePlugin = createBlockPlugin({ type: 'heading-one' })
export const headingTwoPlugin = createBlockPlugin({ type: 'heading-two' })
export const alignLeftPlugin = createBlockPlugin({ type: 'align-left' })
export const alignCenterPlugin = createBlockPlugin({ type: 'align-center' })
export const alignRightPlugin = createBlockPlugin({ type: 'align-right' })