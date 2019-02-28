import React, { Component, createRef } from 'react'
import * as R from 'ramda'
import PropTypes from 'prop-types'
import logger from '../../utils/logger'
import { Editor } from 'slate-react'
import { Value, Block } from 'slate'
import initialValueJSON from './initialValue'
import {
  boldPlugin,
  italicPlugin,
  underlinePlugin,
  codePlugin,
} from './markPlugins'
import {
  handleSetBlock,
  headingOnePlugin,
  headingTwoPlugin,
  alignLeftPlugin,
  alignCenterPlugin,
  alignRightPlugin,
} from './blockPlugins'
import {
  orderedListPlugin,
  unorderedListPlugin,
  indentListPlugin,
} from './listPlugins'
import mentionPlugin from './mentionPlugin'
import imagePlugin from './imagePlugin'
import emojiPlugin from './emojiPlugin'
import { forceRefreshPlugin } from './commandPlugins'
import {
  getMentionInput,
  getBlocks,
  uploadImage,
} from './utils'
import { checkIsBackspaceHotkey, checkIsDeleteHotkey, checkIsSaveHotkey } from './checkHotkey'
import ButtonEditor from '../common/ButtonEditor'
import Icon from '../common/Icon'
import HoverMenu from './HoverMenu'
import ImageHoverMenu from './ImageHoverMenu'
import EmojiMenu from './EmojiMenu'
import MentionMenu from './MentionMenu'
import ImageWidthPopover from './ImageWidthPopover'
import Upload from '../common/Upload'
import { withApollo } from 'react-apollo'
import Spinner from '../common/Spinner'
import notification from '../common/notification'
import detectImageDeletePlugin from './detectImageDeletePlugin'


const userData = [
  {
    id: '1',
    username: 'aaa',
    name: 'ddd ddd',
    picture: 'a'
  },
  {
    id: '2',
    username: 'abc',
    name: 'eee fff',
    picture: 'a'
  },
  {
    id: '3',
    username: 'bckda',
    name: 'bckda bckda',
    picture: 'a'
  },
  {
    id: '4',
    username: 'daddf',
    name: 'daddf daddf',
    picture: 'a'
  },
  {
    id: '5',
    username: 'seunggs',
    name: 'Seungchan Lee',
    picture: 'a'
  },
  {
    id: '6',
    username: 'aaa',
    name: 'ddd ddd',
    picture: 'a'
  },
  {
    id: '7',
    username: 'abc',
    name: 'eee fff',
    picture: 'a'
  },
  {
    id: '8',
    username: 'acddss',
    name: 'bckda bckda',
    picture: 'a'
  },
  {
    id: '9',
    username: 'asde',
    name: 'daddf daddf',
    picture: 'a'
  },
  {
    id: '10',
    username: 'asese',
    name: 'Seungchan Lee',
    picture: 'a'
  },
]

const existingValue = JSON.parse(localStorage.getItem('content'))
const initialValue = Value.fromJSON(existingValue || initialValueJSON)

class CustomEditor extends Component {
  constructor(props) {
    super(props)
    this.editor = createRef()
    this.state = {
      editorWrapperIsFocused: false,
      value: initialValue,
      hoverMenuVisible: false,
      emojiMenuVisible: false,
      users: userData,
      imageLoading: false,
    }
    this.schema = {
      document: {
        last: { type: 'paragraph' },
        normalize: (editor, { code, node, child }) => {
          switch (code) {
            case 'last_child_type_invalid': {
              const paragraph = Block.create('paragraph')
              return editor.insertNodeByKey(node.key, node.nodes.size, paragraph)
            }
            default:
              return
          }
        },
      },
      inlines: {
        emoji: {
          isVoid: true,
        },
        userMention: {
          isVoid: true,
        },
      },
      blocks: {
        imageWrapper: {
          isVoid: true,
        },
      }
    }
  }

  buttonFontSize = '16px'

  handleChange = ({ value }) => {
    // When the document changes, save the serialized HTML to Local Storage.
    if (value.document !== this.state.value.document) {
      const content = JSON.stringify(value.toJSON())
      localStorage.setItem('content', content)
    }

    this.setState(() => ({ value }))
  }

  checkHasSelection = () => {
    const { value } = this.state
    const { fragment, selection } = value

    if (selection.isBlurred || selection.isCollapsed || fragment.text === '') { return false }

    return true
  }

  hideHoverMenu = () => {
    this.setState(() => ({ hoverMenuVisible: false }))
  }

  showHoverMenu = () => {
    if (this.checkHasSelection()) {
      this.setState(() => ({ hoverMenuVisible: true }))
    }
  }

  handleMouseUp = (e, editor, next) => {
    this.showHoverMenu(next)
    return next()
  }

  handleKeyUp = (e, editor, next) => {
    this.showHoverMenu(next)
    return next()
  }

  handleKeyDown = (e, editor, next) => {
    // IMPORTANT: This is a bug with Slate where mode+A & delete will not remove the list wrapper
    // if list is the first element in the editor
    if (checkIsBackspaceHotkey(e) || checkIsDeleteHotkey(e)) {
      setTimeout(() => {
        const firstNode = editor.value.document.nodes.get(0)
        const firstNodeIsAList = R.includes('-list', firstNode.get('type'))
        const listItemExists = firstNode.getBlocksByType('list-item').size > 0
        if (firstNodeIsAList && !listItemExists) {
          this.setState(() => ({ value: Value.fromJSON(initialValueJSON) }), () => {
            const content = JSON.stringify(this.state.value.toJSON())
            localStorage.setItem('content', content)
            editor.focus()
          })
        }
      })
    }
    
    // handle save
    if (checkIsSaveHotkey(e)) {
      this.props.onSave()
    }

    next()
  }

  /**
   * IMPORTANT: DO NOT REMOVE!!!
   * This fixes the Slatejs bug where editor.onFocus() doesn't work for some reason once 
   * the focus has been moved to external component (i.e. insert mention or emoji-mart)
   */
  handleFocus = (e, editor) => {
    editor.focus()
  }

  // IMPORTANT: onMouseDown instead of onClick is important because it won't trigger the selection.isBlurred
  renderMarkButton = (type, icon, size = 'default', theme = 'light') => (
    <ButtonEditor size={size} theme={theme} onMouseDown={e => this.handleMarkClick(e, type)} tabIndex={-1}>
      <Icon type={icon} style={{ fontSize: this.buttonFontSize }} />
    </ButtonEditor>
  )

  renderBlockButton = (type, icon, size = 'default', theme = 'light') => {
    if (type === 'emoji') {
      return (
        <ButtonEditor
          id="emoji-block-button"
          className="relative"
          size={size}
          theme={theme}
          onMouseDown={e => this.setState(state => ({ emojiMenuVisible: !state.emojiMenuVisible }))}
          tabIndex={-1}
        >
          <Icon type={icon} style={{ fontSize: this.buttonFontSize }} />
        </ButtonEditor>
      )
    }

    if (type === 'image') {
      return (
        <Upload onChange={this.handleImageUploadAndInsert}>
          <ButtonEditor style={{ opacity: '1' }} size={size} theme={theme} tabIndex={-1}>
            <Icon type={icon} style={{ fontSize: this.buttonFontSize }} />
          </ButtonEditor>
        </Upload>
      )
    }

    if (type === 'image-width') {
      return (
        <ButtonEditor
          className="relative"
          size={size}
          theme={theme}
          onMouseDown={e => {
            e.preventDefault()
            this.setState(state => ({ imageWidthPopoverVisible: true }))
          }} tabIndex={-1}
        >
          <Icon type={icon} rotate={90} style={{ fontSize: this.buttonFontSize }} />
        </ButtonEditor>
      )
    }

    const isImageAlignType = R.includes('image-align-', type)
    let handleBlockButtonClick
    if (isImageAlignType) {
      handleBlockButtonClick = e => this.handleImageAlignClick(e, type)
    } else {
      handleBlockButtonClick = e => this.handleBlockClick(e, type)
    }

    return (
      <ButtonEditor size={size} theme={theme} onMouseDown={handleBlockButtonClick} tabIndex={-1}>
        <Icon type={icon} style={{ fontSize: this.buttonFontSize }} />
      </ButtonEditor>
    )
  }

  handleMarkClick = (e, type) => {
    const editor = this.editor.current
    e.preventDefault()

    editor.toggleMark(type)
  }

  handleEmojiClick = (emoji, e) => {
    e.preventDefault()

    const { editor } = this.editor.current

    this.setState(() => ({ emojiMenuVisible: false }), () => {
      editor
        .insertInline({ type: 'emoji', data: { emoji } })
        .focus()
        .moveToStartOfNextText()
    })
  }

  handleImageAlignClick = (e, type) => {
    const editor = this.editor.current
    const align = type.replace('image-align-', '')

    editor
      .unwrapBlock('imageWrapper')
      .wrapBlock({
        type: 'imageWrapper',
        data: {
          align
        }
      })
  }

  handleImageWidthClick = (width) => {
    const editor = this.editor.current

    const src = getBlocks(editor.value, 'image').get(0).data.get('src')

    // Set the data of width to the 'image' type
    this.setState(() => ({ imageWidthPopoverVisible: false }), () => {
      editor
        .setBlocks({
          data: {
            src,
            width
          }
        })
        .focus()
        .moveToStartOfNextText()
    })
  }

  handleImageUploadAndInsert = e => {
    const editor = this.editor.current
    const client = this.props.client
    const files = e.target.files
    const uploadPromises = R.map(file => {
      return uploadImage(editor, client, file)
    })(files)

    this.setState({ imageLoading: true })

    Promise.all(uploadPromises)
      .then(responses => {
        this.setState(() => ({ imageLoading: false }), () => {
          R.forEach(({ url }) => {
            editor.insertImage(url)
          })(responses)
        })
      })
      .catch(err => {
        logger.info('Something went wrong while uploading files', err)
        this.setState(() => ({ imageLoading: false }), () => {
          this.openNotification(
            'error',
            'Uploading image unsuccessful',
            'Something went wrong while uploading the image - please try again later'
          )
        })
      })
  }

  handleBlockClick = (e, type) => {
    const editor = this.editor.current
    handleSetBlock(e, editor, type)
  }

  renderEditor = (props, editor, next) => {
    const { size = 'default', hoverMenu = true } = props
    const children = next()
    return (
      <div className="relative">
        {children}
        {hoverMenu ?
          <HoverMenu
            editor={editor}
            visible={this.state.hoverMenuVisible}
            size={size}
            renderMarkButton={this.renderMarkButton}
            renderBlockButton={this.renderBlockButton}
          /> :
          null
        }
        <ImageHoverMenu
          anchor="image-hover-menu-context"
          editor={editor}
          size={size}
          renderMarkButton={this.renderMarkButton}
          renderBlockButton={this.renderBlockButton}
        />
        <EmojiMenu
          editor={editor}
          visible={this.state.emojiMenuVisible}
          onClick={this.handleEmojiClick}
        />
        <ImageWidthPopover
          visible={this.state.imageWidthPopoverVisible}
          editor={editor}
          close={() => this.setState(() => ({ imageWidthPopoverVisible: false }))}
          onAfterChange={this.handleImageWidthClick}
        />
        <MentionMenu
          anchor="user-mention-context" // visibility is controlled by the presence of Mark which sets this anchor id
          active={editor.value.data.get('mentionDropdownId') || 0}
          query={getMentionInput(editor.value)}
          users={editor.value.data.get('filteredUsers') || []}
          onSelect={editor.insertMention}
        />
      </div>
    )
  }

  openNotification = (type, message, description) => {
    notification.open({
      type,
      message,
      description,
    })
  }

  componentDidUpdate() {
    // If selection no longer exists, hide the hover menu
    if (!this.state.hoverMenuVisible) { return } // This prevents an infinite loop

    if (this.checkHasSelection()) { return }

    this.hideHoverMenu()
  }

  componentDidMount() {
    const plugins = [
      forceRefreshPlugin(),
      boldPlugin,
      italicPlugin,
      underlinePlugin,
      codePlugin,
      headingOnePlugin,
      headingTwoPlugin,
      alignLeftPlugin,
      alignCenterPlugin,
      alignRightPlugin,
      orderedListPlugin,
      unorderedListPlugin,
      indentListPlugin,
      emojiPlugin({ type: 'emoji' }),
      mentionPlugin({ type: 'userMention' }),
      imagePlugin({ type: 'image' }),
      detectImageDeletePlugin({ type: 'detect-image-delete' }),
    ]
    this.setState(() => ({ plugins }))

    // Pass setState to editor
    const editor = this.editor.current
    editor.setData({
      setState: this.setState.bind(this),
      client: this.props.client,
      openNotification: this.openNotification,
      users: this.state.users,
    })

    // IMPORTANT: This is required to make sure the save JSON shows formatting on load
    // Due to some Slate bug, it only shows plain text otherwise
    setTimeout(() => editor.refresh().focus().blur(), 0)
  }

  render() {
    const { size = 'default', style, imgFolder = 'test' } = this.props
    const { plugins = [], imageLoading } = this.state
    const baseStyle = { position: 'relative' }
    const editor = this.editor.current
    const editorWrapperFocused = editor ? editor.value.selection.isFocused : false
    const fontSize = size === 'large' ? 'f4' : 'f5'

    return (
      /**
       * IMPORTANT: id="editor" position must be in this container, not in <Editor /> because
       * the hover menus attach themselves to #editor. If #editor is attached to <Editor />, and you 
       * select all, it'll also select the hover elements, which will cause the selection value to oscillate,
       * creaing infinite loop.
       */
      <div id="editor" className={`editor ${editorWrapperFocused ? 'editor-focused' : ''} ${fontSize}`}>
        {imageLoading ? <Spinner page={true} /> : null}
        <div className="pv3 ph3">
          <Editor
            ref={this.editor}
            value={this.state.value}
            onChange={this.handleChange}
            placeholder="What do you want to say?"
            plugins={plugins}
            onMouseUp={this.handleMouseUp}
            onKeyUp={this.handleKeyUp}
            onKeyDown={this.handleKeyDown}
            onFocus={this.handleFocus}
            renderEditor={this.renderEditor}
            schema={this.schema}
            tabIndex={0}
            style={R.merge(baseStyle, style)}
            imgFolder={imgFolder} // folder to save images to (AWS)
            {...this.props}
          />
        </div>
        <div className="mb2 mh2 br2">
          {this.renderMarkButton('bold', 'bold', size)}
          {this.renderMarkButton('italic', 'italic', size)}
          {this.renderMarkButton('underline', 'underline', size)}
          {this.renderMarkButton('code', 'code', size)}
          {/* {this.renderBlockButton('heading-one', 'code', size)}
          {this.renderBlockButton('heading-two', 'code', size)} */}
          {this.renderBlockButton('align-left', 'align-left', size)}
          {this.renderBlockButton('align-center', 'align-center', size)}
          {this.renderBlockButton('align-right', 'align-right', size)}
          {this.renderBlockButton('unordered-list', 'bars', size)}
          {this.renderBlockButton('ordered-list', 'ordered-list', size)}
          {this.renderBlockButton('emoji', 'smile', size)}
          {this.renderBlockButton('image', 'picture', size)}
        </div>
      </div>
    )
  }
}

CustomEditor.propTypes = {
  hoverMenu: PropTypes.bool, // false for no hover menu - defaults to true
  onSave: PropTypes.func,
  size: PropTypes.string, // 'default' or 'large'
  imgFolder: PropTypes.string, // ignored if 'projectId' is present
  projectId: PropTypes.string,
}

export default withApollo(CustomEditor)