import React from 'react'
import { getEventRange, getEventTransfer } from 'slate-react'
import imageExtensions from 'image-extensions'
import isUrl from 'is-url'
import { DEFAULT_IMAGE_WIDTH } from '../../utils/constants'
import { checkHasBlock } from './utils'

const imagePlugin = (options) => {
  const { type } = options

  return {
    commands: {
      // width is an Int in percentage -> 100 is '100%'
      insertImage(editor, src, width = DEFAULT_IMAGE_WIDTH) {
        editor
          .insertBlock({
            type,
            data: { src, width },
          })
          .wrapBlock(`${type}Wrapper`)
          .addMark(type)
      },
      checkIsImage(url) {
        return !!imageExtensions.find(url.endsWith)
      },
      handleDropOrPaste(editor, event, next) {
        const target = getEventRange(event, editor)
        if (!target && event.type === 'drop') return next()

        const transfer = getEventTransfer(event)
        const { type, text, files } = transfer

        if (type === 'files') {
          for (const file of files) {
            const reader = new FileReader()
            const [mime] = file.type.split('/')
            if (mime !== 'image') continue

            reader.addEventListener('load', () => {
              editor.insertImage(reader.result, DEFAULT_IMAGE_WIDTH)
            })

            reader.readAsDataURL(file)
          }
          return
        }

        if (type === 'text') {
          if (!isUrl(text)) return next()
          if (!editor.checkIsImage(text)) return next()
          editor.insertImage(text, DEFAULT_IMAGE_WIDTH)
          return
        }
      }
    },
    onDrop(event, editor, next) {
      if (type === 'image') {
        console.log('onDrop')
        editor.handleDropOrPaste(event, next)
        return next()
      }
    },
    onPaste(event, editor, next) {
      if (type === 'image') {
        console.log('onPaste')
        editor.handleDropOrPaste(event, next)
        return next()
      }
    },
    renderNode(props, editor, next) {
      const { children, attributes, node, isFocused } = props

      switch (node.type) {
        case 'image':
          const { data } = node
          const src = data.get('src')
          const width = data.get('width')
          const imageClass = isFocused ? 'editor-image-focused' : ''
          const id = isFocused ? 'image-hover-menu-context' : ''
          return (
            <div style={{ width: `${width}%` }} {...attributes}>
              <img
                id={id}
                src={src}
                className={imageClass}
                style={{ width: '100%' }}
                {...attributes}
              />
            </div>
          )
        case 'imageWrapper':
          return <div className="flex" {...attributes}>{children}</div>
        default:
          return next()
      }
    },
  }
}

export default imagePlugin