import React, { Component } from 'react'
import { withApollo } from 'react-apollo'
import { connect } from 'react-redux'
import { history } from '../App'
import { Link } from 'react-router-dom'
import { startLogout } from '../actions/auth'

class Header extends Component {
  handleLogout = () => {
    const { startLogout, client } = this.props
    startLogout(history, client)
  }
  render() {
    const { auth } = this.props
    return (
      <div className="pv3">
        <div>{auth.isAuthenticated ? <button onClick={this.handleLogout}>Log out</button> : <Link to='/'>Login</Link>}</div>
      </div>
    )
  }
}

const mapStateToProps = ({ auth }) => ({ auth })

export default connect(mapStateToProps, { startLogout })(withApollo(Header))