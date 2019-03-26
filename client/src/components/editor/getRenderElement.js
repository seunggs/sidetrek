import React from 'react'
import Emoji from '../common/Emoji'

const getRenderElement = ({ type, children, attributes = {}, data = { get: () => {} }, isFocused = false }) => {
  switch (type) {
    case 'paragraph':
      return <p className="mb0" {...attributes}>{children}</p>
    case 'bold':
      return <strong {...attributes}>{children}</strong>
    case 'italic':
      return <i {...attributes}>{children}</i>
    case 'underline':
      return <u {...attributes}>{children}</u>
    case 'code':
      return <code className="pa1 bg-near-white br3" {...attributes}>{children}</code>
    case 'block-quote':
      return <blockquote {...attributes}>{children}</blockquote>
    case 'heading-one':
      return <h1 className="f2 fw4" {...attributes}>{children}</h1>
    case 'heading-two':
      return <h2 className="f3 fw4" {...attributes}>{children}</h2>
    case 'align-left':
      return <div className="tl" {...attributes}>{children}</div>
    case 'align-center':
      return <div className="tc" {...attributes}>{children}</div>
    case 'align-right':
      return <div className="tr" {...attributes}>{children}</div>
    case 'list-item':
      return <li {...attributes}>{children}</li>
    case 'unordered-list':
      return <ul style={{ paddingLeft: '20px', marginBottom: '0' }} {...attributes}>{children}</ul>
    case 'ordered-list':
      const start = data.get('orderedListNum')
      return <ol start={start} style={{ paddingLeft: '20px', marginBottom: '0' }} {...attributes}>{children}</ol>
    case 'indent-list':
      return <ul style={{ paddingLeft: '20px', marginBottom: '0', listStyleType: 'none' }} {...attributes}>{children}</ul>
    case 'image':
      const imageClass = isFocused ? 'editor-image-focused' : ''
      const id = isFocused ? 'image-hover-menu-context' : ''
      const src = data.get('src')
      const width = data.get('width')

      return (
        <div style={{ width: `${width}%` }} {...attributes}>
          <img
            id={id}
            alt={src}
            src={src}
            className={imageClass}
            style={{ width: '100%' }}
          />
        </div>
      )
    case 'imageWrapper':
      const align = data.get('align')
      let alignClassName
      switch (align) {
        case 'left':
          alignClassName = 'items-start'
          break
        case 'center':
          alignClassName = 'items-center'
          break
        case 'right':
          alignClassName = 'items-end'
          break
        default:
          alignClassName = 'items-start'
      }
      return <div className={`flex flex-column ${alignClassName}`} {...attributes}>{children}</div>
    case 'userMentionMark':
      return <span {...attributes} id="user-mention-context">{children}</span>
    case 'userMention':
      return <span className="dib dark-blue link glow bg-lightest-blue o-80 br2 ph1" {...attributes}>{data.get('text')}</span>
    case 'emoji':
      return (
        <Emoji className="dib relative" style={{ transform: 'scale(1.5)', marginLeft: '6px', marginRight: '2px' }} {...attributes}>
          {data.get('emoji').native}
        </Emoji>
      )
    default:
      return null
  }
}

export default getRenderElement