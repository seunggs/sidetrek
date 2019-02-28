import * as R from 'ramda'
import { deleteImage, getBlocks } from './utils'
import {
  checkIsDeleteHotkey,
  checkIsBackspaceHotkey,
} from './checkHotkey'

const detectImageDeletePlugin = (options) => {
  const { type } = options
  return {
    onKeyDown(event, editor, next) {
      if (type === 'detect-image-delete') {
        const { value } = editor
        const imageBlocks = getBlocks(value, 'image')
        if (
          (checkIsDeleteHotkey(event) || checkIsBackspaceHotkey(event)) &&
          imageBlocks.size > 0
        ) {
          const { data } = value
          const client = data.get('client')

          R.forEach(imageBlock => {
            const { data } = imageBlock
            const url = data.get('src')
            
            deleteImage(client, url)
              .catch(err => {
                // Don't do anything if delete fails - could be because of URL paste
                // which doesn't save in our server. Even if it's an actual error, it's not
                // critical and better left unhandled.
              })
          })(imageBlocks)
        }
      }
      
      return next()
    },
  }
}

export default detectImageDeletePlugin