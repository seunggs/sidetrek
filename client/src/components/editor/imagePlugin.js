import * as R from 'ramda'
import logger from '../../utils/logger'
import { getEventRange, getEventTransfer } from 'slate-react'
import isUrl from 'is-url'
import { DEFAULT_IMAGE_WIDTH } from '../../utils/constants'
import { checkIsImage, uploadImage } from './utils'
import getRenderElement from './getRenderElement'

const imagePlugin = (options) => {
  const { type } = options

  return {
    commands: {
      // width is an Int in percentage -> 100 is '100%'
      insertImage(editor, src, target, width = DEFAULT_IMAGE_WIDTH) {
        if (target) {
          editor.select(target)
        }

        editor
          .insertBlock({
            type,
            data: { src, width, align: 'left' },
          })
          .wrapBlock(`${type}Wrapper`)
          .focus()
          .moveToStartOfNextText()
      },
      handleDropOrPaste(editor, event, next) {
        const { data } = editor.value
        const setState = data.get('setState')
        const client = data.get('client')
        const openNotification = data.get('openNotification')

        const target = getEventRange(event, editor)
        if (!target && event.type === 'drop') return next()

        const transfer = getEventTransfer(event)
        const { type, text, files } = transfer

        if (type === 'files') {
          setState({ imageLoading: true })

          const uploadPromises = R.map(file => {
            return uploadImage(editor, client, file)
          })(files)

          Promise.all(uploadPromises)
            .then(responses => {
              setState(() => ({ imageLoading: false }), () => {
                R.forEach(({ url }) => {
                  editor.insertImage(url, target)
                })(responses)
              })
            })
            .catch(err => {
              logger.info('Something went wrong while uploading files', err)
              setState({ imageLoading: false }, () => {
                openNotification(
                  'error',
                  'Uploading image unsuccessful',
                  'Something went wrong while uploading the image - please try again later'
                )
              })
            })

          return
        }

        if (type === 'text') {
          if (!isUrl(text)) return next()
          if (!checkIsImage(text)) return next()

          // Don't have to upload image because it's obviously already uploaded somewhere
          editor.insertImage(text, target)
          return
        }

        next()
      }
    },
    onDrop(event, editor, next) {
      if (type === 'image') {
        editor.handleDropOrPaste(event, next)
        return next()
      }
    },
    onPaste(event, editor, next) {
      if (type === 'image') {
        editor.handleDropOrPaste(event, next)
        return next()
      }
    },
    renderNode(props, editor, next) {
      const { children, attributes, node, isFocused } = props
      const { data } = node

      switch (node.type) {
        case 'image':
          return getRenderElement({ type: node.type, children, attributes, data, isFocused })
        case 'imageWrapper':
          return getRenderElement({ type: node.type, children, attributes, data, isFocused })
        default:
          return next()
      }
    },
  }
}

export default imagePlugin