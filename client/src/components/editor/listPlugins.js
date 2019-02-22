import React from 'react'
import * as R from 'ramda'
import {
  getCurrentBlockText,
  checkIsList,
  checkIsType,
  checkIsTopLevelListItem,
  checkIsEmptyPriorToHotkeyPress,
  checkIsEmptyLeftToUnorderedListHotkey,
  checkIsEmptyLeftToOrderedListHotkey,
} from './utils'
import {
  checkIsBackspaceHotkey,
  checkIsReturnHotkey,
  checkIsTabHotkey,
  checkIsUntabHotkey,
} from './blockPlugins'

const DEFAULT_NODE = 'paragraph'

const checkIsUnorderedListHotkey = (event, value) => {
  const text = getCurrentBlockText(event, value)
  return text === '* '
}

const checkIsOrderedListHotkey = (event, value) => {
  const text = getCurrentBlockText(event, value)
  return R.any(num => text === `${num}. `)(R.range(1, 100))
}

function checkIsListDeleteHotkey(event) {
  return checkIsBackspaceHotkey(event) || checkIsReturnHotkey(event)
}

function handleUnorderedListHotkey(event, editor, type) {
  event.preventDefault()

  // Delete the hotkey pressed (i.e. '*') from text first
  editor.deleteBackward(1)

  handleSetList(editor, type)
  return
}

function handleOrderedListHotkey(event, editor, type) {
  event.preventDefault()

  // Delete the hotkey pressed (i.e. '1.') from text first
  const hotkeyLength = editor.value.blocks.get(0).text.length
  editor.deleteBackward(hotkeyLength)

  handleSetList(editor, type)
  return
}

function handleDeleteListHotkey(event, editor, type) {
  event.preventDefault()

  editor
    .setBlocks(DEFAULT_NODE)
    .unwrapBlock(type)

  return
}

function handleTabListHotkey(event, editor, type) {
  event.preventDefault()

  editor
    .setBlocks('list-item')
    .wrapBlock(type)

  return
}

function handleUntabListHotkey(event, editor, type) {
  event.preventDefault()

  const { value } = editor

  editor.unwrapBlock(type)

  if (checkIsTopLevelListItem(value)) {
    editor.setBlocks(DEFAULT_NODE)
  }

  return
}

// Handles setting of both ordered and unordered lists
export function handleSetList(editor, type) {
  const { value } = editor

  console.log('Running')

  // Handle the extra wrapping required for list buttons
  if (checkIsList(value) && checkIsType(value, type)) {
    // If it's a list and is the same type (ordered or unordered) as the pressed list, then
    // undo the list (i.e. make it a paragraph)
    editor
      .setBlocks(DEFAULT_NODE)
      .unwrapBlock(type)
  } else if (checkIsList(value)) {
    // If it's a list but is not the same type as the pressed list, then switch to the list type pressed
    editor
      .unwrapBlock(type === 'unordered-list' ? 'ordered-list' : 'unordered-list')
      .wrapBlock(type)
  } else {
    // If it's not a list right now, make it one
    editor
      .setBlocks('list-item')
      .wrapBlock(type)
  }
}

function createListBlockPlugin(options) {
  const { type } = options

  return {
    renderNode(props, editor, next) {
      const { children, node, attributes } = props

      switch (node.type) {
        case 'list-item':
          return <li {...attributes}>{children}</li>
        case 'unordered-list':
          return <ul {...attributes}>{children}</ul>
        case 'ordered-list':
          return <ol {...attributes}>{children}</ol>
        default:
          return next()
      }
    },
    onKeyDown(event, editor, next) {
      const { value } = editor

      // Handle lists since their hotkeys are unique
      if (type === 'unordered-list' || type === 'ordered-list') {
        if (
          type === 'unordered-list' &&
          checkIsUnorderedListHotkey(event, value) &&
          !checkIsList(value) && // if already a list, ignore the hotkey
          checkIsEmptyLeftToUnorderedListHotkey(event, value, type)
        ) {
          // logger.info('unordered list hotkey pressed')
          handleUnorderedListHotkey(event, editor, type)
          return next()
        }

        if (
          type === 'ordered-list' &&
          checkIsOrderedListHotkey(event, value) &&
          !checkIsList(value) &&
          checkIsEmptyLeftToOrderedListHotkey(event, value, type)
        ) {
          // logger.info('ordered list hotkey pressed', type)
          handleOrderedListHotkey(event, editor, type)
          return next()
        }

        // Handle list delete hotkey
        if (
          checkIsListDeleteHotkey(event) &&
          checkIsList(value) &&
          checkIsType(value, type) &&
          checkIsEmptyPriorToHotkeyPress(value)
        ) {
          // logger.info('list delete hotkey pressed')
          handleDeleteListHotkey(event, editor, type)
          return next()
        }

        // Handle list tab hotkey
        if (
          checkIsTabHotkey(event) &&
          checkIsList(value) &&
          checkIsType(value, type)
        ) {
          // logger.info('list tab hotkey pressed')
          handleTabListHotkey(event, editor, type)
          return next()
        }

        // Handle list untab hotkey
        if (
          checkIsUntabHotkey(event) &&
          checkIsList(value) &&
          checkIsType(value, type)
        ) {
          // logger.info('list untab hotkey pressed')
          handleUntabListHotkey(event, editor, type)
          return next()
        }
      }
      return next()
    },
  }
}

export const orderedListPlugin = createListBlockPlugin({ type: 'ordered-list' })
export const unorderedListPlugin = createListBlockPlugin({ type: 'unordered-list' })