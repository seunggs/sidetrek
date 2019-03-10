import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import Header from './Header'
import UsernameForm from './auth/UsernameForm'

class UsernamePage extends Component {
  componentDidMount() {
    const { user, history } = this.props
    if (user.username) {
      history.replace('/')
    }
  }

  render() {
    return (
      <div>
        <Header />
  
        <div>Set username</div>
  
        <div>
          <UsernameForm />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user
})

export default withRouter(connect(mapStateToProps)(UsernamePage))