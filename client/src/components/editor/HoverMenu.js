import React, { Component, createRef } from 'react'
import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import * as R from 'ramda'
import { calcHoverPosition } from './utils'

const DEFAULT_POSITION = {
  zIndex: '-1',
  opacity: '0',
  transform: 'translateY(15%)',
}

class HoverMenu extends Component {
  constructor(props) {
    super(props)
    this.hoverMenu = createRef()
    this.state = {
      menuPosition: DEFAULT_POSITION,
    }
  }

  setMenuPosition = () => {
    const { visible = false } = this.props
    const prevPosition = this.state.menuPosition

    const selection = window.getSelection()
    if (selection && selection.rangeCount <= 0) { return }

    const hoverMenuPos = this.hoverMenu.current.getBoundingClientRect()
    const editorPos = window.document.getElementById('editor').getBoundingClientRect()
    const cursorPos = selection.getRangeAt(0).getBoundingClientRect()
    const newPosition = visible ? R.merge({ zIndex: '1', opacity: '1', transform: 'translateY(0)', }, calcHoverPosition(hoverMenuPos, editorPos, cursorPos)) : DEFAULT_POSITION

    if (R.equals(prevPosition, newPosition)) { return } // prevents infinite loops

    this.setState(() => ({ menuPosition: newPosition }))
  }

  componentDidUpdate() {
    this.setMenuPosition()
  }

  componentDidMount() {
    this.setMenuPosition()
  }

  render() {
    const menuPosition = this.state.menuPosition
    const { visible = false, size = 'default', renderMarkButton, renderBlockButton } = this.props
    const editorElem = window.document.getElementById('editor')
    const idToAttachPortal = editorElem ? 'editor' : 'root' 

    return createPortal(
      <span ref={this.hoverMenu} className="absolute z-1 br3 dib ph3 pv3 bg-dark-gray transition-in" style={visible ? menuPosition : { display: 'none' }}>
        {renderMarkButton('bold', 'bold', size, 'dark')}
        {renderMarkButton('italic', 'italic', size, 'dark')}
        {renderMarkButton('underline', 'underline', size, 'dark')}
        {renderMarkButton('code', 'code', size, 'dark')}
        {renderBlockButton('unordered-list', 'bars', size, 'dark')}
        {renderBlockButton('ordered-list', 'ordered-list', size, 'dark')}
        {renderBlockButton('emoji', 'smile', size, 'dark')}
      </span>,
      document.getElementById(idToAttachPortal)
    )
  }
}

HoverMenu.propTypes = {
  editor: PropTypes.object,
  visible: PropTypes.bool,
  size: PropTypes.string,
  renderMarkButton: PropTypes.func,
  renderBlockButton: PropTypes.func,
}

export default HoverMenu