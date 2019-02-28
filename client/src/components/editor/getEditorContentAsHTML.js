import React from 'react'
import * as R from 'ramda'
import { Value } from 'slate'
import Html from 'slate-html-serializer'
import getRenderElement from './getRenderElement'

/**
 * Usage:
 *    <div dangerouslySetInnerHTML={{__html: getEditorContentAsHTML(localStorage.getItem('content'))}} />
 */

const RULES = [
  {
    serialize(obj, children) {
      // Handle empty line disappearing by checking if it's a top-most paragraph with empty text 
      if (obj.type === 'paragraph' && obj.getTexts().size === 1 && R.trim(obj.getTexts().get(0).text) === '') {
        return <p className="mb0">&nbsp;</p>
      }

      return getRenderElement({ type: obj.type, children, data: obj.data })
    },
  },
]

const serializer = new Html({ rules: RULES })

// content is a stringified JSON
const getEditorContentAsHTML = content => {
  if (R.isNil(content) || R.isEmpty(content)) { return null }
  return serializer.serialize(Value.fromJSON(JSON.parse(content)))
} 

export default getEditorContentAsHTML