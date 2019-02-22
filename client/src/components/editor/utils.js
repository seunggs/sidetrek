import * as R from 'ramda'

export const getBlocks = (value, type) => {
  return value.blocks.filter(node => node.type === type)
}

export const checkHasBlock = (value, type) => {
  return value.blocks.some(node => node.type === type)
}

export const getCurrentBlockText = (event, value) => {
  // Including the latest key pressed
  if (!value.blocks || !value.blocks.get(0)) { return null }
  return value.blocks.get(0).text + event.key
}

export const checkIsList = (value) => {
  return checkHasBlock(value, 'list-item')
}

export const checkIsType = (value, type) => {
  const { document } = value
  return value.blocks.some(block => {
    return !!document.getClosest(block.key, parent => parent.type === type)
  })
}

export const checkIsTopLevelListItem = (value) => {
  const { document } = value
  const ancestorLists = document.getAncestors(value.blocks.get(0).key)
    .filter(node => node.type === 'ordered-list' || node.type === 'unordered-list')
  const numOfAcenstorLists = ancestorLists.size
  return numOfAcenstorLists <= 1
}

export const checkIsEmptyPriorToHotkeyPress = (value) => {
  return value.blocks.get(0).text === ''
}

export const checkIsEmptyLeftToUnorderedListHotkey = (event, value, type) => {
  const text = getCurrentBlockText(event, value)
  return R.compose(R.isEmpty, R.head, R.split('*'))(text)
}

export const checkIsEmptyLeftToOrderedListHotkey = (event, value, type) => {
  const text = getCurrentBlockText(event, value)
  return R.compose(num => parseInt(num) >= 1 && parseInt(num) <= 99, R.head, R.split('.'))(text)
}

export const getMentionInput = (value) => {
  // In some cases, like if the node that was selected gets deleted,
  // `startText` can be null.
  if (!value.startText) { return null }
  
  const startOffset = value.selection.start.offset
  const textBefore = value.startText.text.slice(0, startOffset)
  const result = /@(\S*)$/.exec(textBefore)

  return result === null ? null : result[1]
}

/**
 * Determine if the current selection has valid ancestors for a context. 
 * For example, we want to make sure that the mention is only a direct child of a paragraph.
 */
export const checkHasValidAncestors = (value, validAncestors = []) => {
  const { document, selection } = value

  const invalidParent = document.getClosest(
    selection.start.key,
    node => R.all(validAncestor => node.type !== validAncestor)(validAncestors)
  )

  return !invalidParent
}

/**
 * Returns { top, left } for absolute positioned elements
 * @param {*} hoverElemRect - from getBoundingClientRect
 * @param {*} parentRect - from getBoundingClientRect
 * @param {*} selectionRect - from getBoundingClientRect
 * @param {*} options - dropBottom: makes the hover element go below the bottom of selection if true
 */
export const calcHoverPosition = (hoverElemRect, parentRect, selectionRect, { dropBottom = true } = {}) => {
  const gap = 10 // space between the hover elem and top of selection when hovering on top

  // Position of selectionRect relative to the parentRect
  // NOTE: this is for absolute positioning - i.e. relativeRightPos of 10px means 10px from the right edge of parentRect
  const relativeTopPos = selectionRect.top - parentRect.top
  const relativeLeftPos = selectionRect.left - parentRect.left
  const relativeBottomPos = parentRect.bottom - selectionRect.bottom
  const relativeRightPos = parentRect.right - selectionRect.right

  const hoverElemRelativeLeftPos = relativeLeftPos + (selectionRect.width / 2) - (hoverElemRect.width / 2)
  const hoverElemRelativeRightPos = relativeRightPos + (selectionRect.width / 2) - (hoverElemRect.width / 2)

  const topPos = relativeTopPos - (hoverElemRect.height + gap)
  const rightPos = hoverElemRelativeRightPos
  const leftPos = hoverElemRelativeLeftPos
  const top = selectionRect.top <= (hoverElemRect.height + gap) ? (
    dropBottom ?
      window.innerHeight - relativeBottomPos + gap :
      relativeTopPos + gap
  ) : topPos
  const right = hoverElemRelativeRightPos <= 0 ? 0 : rightPos
  const left = hoverElemRelativeLeftPos <= 0 ? 0 : leftPos
  const selectionInLeftHalf = selectionRect.left + (selectionRect.width / 2) < (window.innerWidth / 2)
  
  return R.mergeAll([{ top }, selectionInLeftHalf ? { left } : {}, !selectionInLeftHalf ? { right } : {}])
}