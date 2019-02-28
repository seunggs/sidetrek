import * as R from 'ramda'
import search from '../../utils/search'
import {
  getMentionInput,
  checkHasValidAncestors,
} from './utils'
import {
  checkIsReturnHotkey,
  checkIsUpHotkey,
  checkIsDownHotkey,
} from './checkHotkey'
import getRenderElement from './getRenderElement'

const mentionPlugin = (options) => {
  const { type } = options
  let lastInputValue = null

  return {
    commands: {
      insertMention(editor, user) {
        if (!user) { return }

        const { value } = editor
        const inputValue = getMentionInput(value)
        const text = `@${user.username}`

        // Delete the captured value, including the `@` symbol
        editor.deleteBackward(inputValue.length + 1)

        const selectedRange = editor.value.selection

        editor
          .insertText(' ')
          .insertInlineAtRange(selectedRange, {
            data: {
              id: user.id,
              username: user.username,
              picture: user.picture,
              text
            },
            nodes: [
              {
                object: 'text',
                leaves: [
                  {
                    text
                  },
                ],
              },
            ],
            type: 'userMention',
          })
          .focus()

        return
      },
      searchUser(editor, searchTerm, isWildCard = true) {
        const data = editor.value.data
        const users = data.get('users')
        const setState = data.get('setState')
        const client = data.get('client')
        const openNotification = data.get('openNotification')
        const filteredUsers = search({
          data: users,
          id: 'id',
          fields: [{ name: 'username', boost: '2' }, { name: 'name' }]
        }, isWildCard ? searchTerm + '*' : searchTerm)
        editor.setData({ setState, client, openNotification, users, filteredUsers })
      },
      checkHasValidAncestors(editor) {
        const { value } = editor
        return checkHasValidAncestors(value, ['paragraph', 'unordered-list', 'ordered-list', 'list-item'])
      },
      decorate(editor, inputValue, hasValidAncestors) {
        const { value } = editor
        const { selection } = value

        let decorations = value.decorations.filter(
          value => value.mark.type !== type
        )

        if (!R.isNil(inputValue) && hasValidAncestors) {
          decorations = decorations.push({
            anchor: {
              key: selection.start.key,
              offset: selection.start.offset - (inputValue.length + 1),
            },
            focus: {
              key: selection.start.key,
              offset: selection.start.offset,
            },
            mark: {
              type,
            },
          })
        }
        editor.setDecorations(decorations)
      }
    },
    onKeyDown(event, editor, next) {
      if (type === 'userMention') {
        const { value } = editor
        const { data } = editor.value
        const setState = data.get('setState')
        const client = data.get('client')
        const inputValue = getMentionInput(value)

        if (!R.isNil(inputValue)) {
          const users = value.data.get('users')
          const filteredUsers = value.data.get('filteredUsers')
          const mentionDropdownId = value.data.get('mentionDropdownId') || 0
          const openNotification = data.get('openNotification')
          if (checkIsDownHotkey(event)) {
            event.preventDefault()
            const maxCount = filteredUsers.length <= 5 ? filteredUsers.length : 5
            editor.setData({
              setState,
              client,
              openNotification,
              users,
              filteredUsers,
              mentionDropdownId: mentionDropdownId < maxCount ?
                mentionDropdownId + 1 :
                mentionDropdownId
            })
          } else if (checkIsUpHotkey(event)) {
            event.preventDefault()
            editor.setData({
              setState,
              client,
              openNotification,
              users,
              filteredUsers,
              mentionDropdownId: mentionDropdownId > 1 ?
                mentionDropdownId - 1 :
                mentionDropdownId
            })
          } else if (checkIsReturnHotkey(event)) {
            event.preventDefault()
            const user = filteredUsers[mentionDropdownId - 1]
            // IMPORTANT: setState is required for event.preventDefault() from working here for some reason (not sure why)
            setState(() => ({}), () => editor.insertMention(user))
          }
          return next()
        }
        return next()
      }
    },
    onChange(editor, next) {
      if (type === 'userMention') {
        /**
         * Handle mention. If the text is mention:
         *    1) Run search to filter the users that match the mention
         *    2) Set the mark with the anchor class so the mention menu will become visible
         */
        const { value } = editor
        const inputValue = getMentionInput(value)

        if (inputValue !== lastInputValue) {
          lastInputValue = inputValue

          const hasValidAncestors = editor.checkHasValidAncestors()

          if (hasValidAncestors) { editor.searchUser(inputValue) }

          editor.decorate(inputValue, hasValidAncestors)

          /**
           * If the mention is exact match with username, insert mention node (by replacing the text)
           * This is the same as selecting the user from the mention menu
           */
          const filteredUsers = value.data.get('filteredUsers') || value.data.get('users')
          if (filteredUsers.length === 1 && inputValue === filteredUsers[0].username) {
            editor.insertMention(filteredUsers[0])
          }
          return next()
        }
        return next()
      }
    },
    renderMark(props, editor, next) {
      const { children, mark, attributes } = props
      switch (mark.type) {
        case 'userMention':
          // just used as an anchor for positioning
          return getRenderElement({ type: 'userMentionMark', children, attributes })
        default:
          return next()
      }
    },
    renderNode(props, editor, next) {
      const { children, node, attributes } = props
      switch (node.type) {
        case 'userMention':
          return getRenderElement({ type: node.type, children, attributes, data: node.data })
        default:
          return next()
      }
    },
  }
}

export default mentionPlugin