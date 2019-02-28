import isHotkey from 'is-hotkey'
import { checkHasBlock } from './utils'
import { handleSetList } from './listPlugins'
import { DEFAULT_NODE, DEFAULT_IMAGE_WIDTH } from '../../utils/constants'
import getRenderElement from './getRenderElement'

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
        case 'paragraph':
          return getRenderElement({ type: node.type, children, attributes })
        case 'block-quote':
          return getRenderElement({ type: node.type, children, attributes })
        case 'heading-one':
          return getRenderElement({ type: node.type, children, attributes })
        case 'heading-two':
          return getRenderElement({ type: node.type, children, attributes })
        case 'align-left':
          return getRenderElement({ type: node.type, children, attributes })
        case 'align-center':
          return getRenderElement({ type: node.type, children, attributes })
        case 'align-right':
          return getRenderElement({ type: node.type, children, attributes })
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