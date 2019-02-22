import React, { Component } from 'react'
import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import * as R from 'ramda'

const SuggestionList = ({ query, style, children, ...rest }) => {
  const baseStyle = { listStyle: 'none', width: '300px', maxHeight: '185px' }
  const finalStyle = R.merge(baseStyle, style)

  return (
    <ul
      className="absolute z-1 bg-white ba br3 pl0 overflow-hidden b--moon-gray"
      style={finalStyle}
      {...rest}
    >
      <div className="f6 ph3 pv2 bg-light-gray silver">People matching "@{query}"</div>
      {children}
    </ul>
  )
}

const Suggestion = ({ active, style, children, ...rest }) => (
  <li className={`ph3 pv2 hover-bg-blue hover-white pointer ${active ? 'bg-blue white' : ''}`} {...rest}>
    {children}
  </li>
)

const DEFAULT_POSITION = {
  top: -10000,
  left: -10000,
}

class MentionMenu extends Component {
  constructor(props) {
    super(props)
    this.state = {
      menuPosition: DEFAULT_POSITION
    }
  }

  componentDidMount = () => {
    this.updateMenu()
  }

  componentDidUpdate = () => {
    this.updateMenu()
  }

  render() {
    const root = window.document.getElementById('root')
    const { users, query, active } = this.props
    const { menuPosition } = this.state

    return createPortal(
      <SuggestionList
        query={query}
        style={{
          top: `${menuPosition.top}px`,
          left: `${menuPosition.left}px`,
        }}
      >
        {users.map((user, i) => {
          const isActive = active === i + 1

          return (
            <Suggestion key={user.id} active={isActive} onClick={() => this.props.onSelect(user)}>
              <span className="br3 mr2" style={{ width: '20px', height: '20px' }}>{user.picture}</span>
              <span className="fw6 mr2">{user.username}</span>
              <span>{user.name}</span>
            </Suggestion>
          )
        })}
      </SuggestionList>,
      root
    )
  }

  updateMenu() {
    const anchor = window.document.getElementById(this.props.anchor)
    const anchorRect = anchor ? anchor.getBoundingClientRect() : {}

    const oldPosition = this.state.menuPosition
    const newPosition = anchor ? {
      top: anchorRect.bottom + 6,
      left: anchorRect.left - 13,
    } : DEFAULT_POSITION

    if (R.equals(oldPosition, newPosition)) { return } // prevents infinite loop

    this.setState(() => ({ menuPosition: newPosition }))
  }
}

MentionMenu.propTypes = {
  anchor: PropTypes.string,
  users: PropTypes.array,
  onSelect: PropTypes.func,
}

export default MentionMenu