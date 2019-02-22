import React, { Component, createRef } from 'react'
import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import * as R from 'ramda'
import { calcHoverPosition, checkHasBlock } from './utils'

const DEFAULT_POSITION = {
  zIndex: '-1',
  opacity: '0',
  transform: 'translateY(15%)',
}

class ImageHoverMenu extends Component {
  constructor(props) {
    super(props)
    this.imageHoverMenu = createRef()
    this.state = {
      menuPosition: DEFAULT_POSITION,
    }
  }

  setMenuPosition = () => {
    const { editor } = this.props
    
    const imageHoverMenuPos = this.imageHoverMenu.current.getBoundingClientRect()
    const anchor = window.document.getElementById(this.props.anchor)
    const anchorPos = anchor ? anchor.getBoundingClientRect() : 0
    const editorPos = window.document.getElementById('editor').getBoundingClientRect()

    const oldPosition = this.state.menuPosition
    const calculatedPosition = calcHoverPosition(imageHoverMenuPos, editorPos, anchorPos, { dropBottom: false })
    
    // Don't show the menu if selection includes something other than image - checkHasBlock checks for this
    const newPosition = anchor && !checkHasBlock(editor.value, 'paragraph') ? R.merge({ zIndex: '1', opacity: '1', transform: 'translateY(0)', }, calculatedPosition) : DEFAULT_POSITION

    if (R.equals(oldPosition, newPosition)) { return } // prevents infinite loop

    this.setState(() => ({ menuPosition: newPosition }))
  }

  componentDidUpdate() {
    this.setMenuPosition()
  }

  componentDidMount() {
    this.setMenuPosition()
  }

  render() {
    const { size = 'default', renderMarkButton, renderBlockButton } = this.props
    const menuPosition = this.state.menuPosition
    const editorElem = document.getElementById('editor')
    const idToAttachPortal = editorElem ? 'editor' : 'root' 

    return createPortal(
      <span ref={this.imageHoverMenu} className="absolute br3 dib ph3 pv3 bg-dark-gray transition-in" style={menuPosition}>
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

ImageHoverMenu.propTypes = {
  anchor: PropTypes.string,
  editor: PropTypes.object,
  size: PropTypes.string,
  renderMarkButton: PropTypes.func,
  renderBlockButton: PropTypes.func,
}

export default ImageHoverMenu