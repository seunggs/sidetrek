import React, { Component } from 'react'
import { withApollo } from 'react-apollo'
import { connect } from 'react-redux'
import { history } from '../App'
import { withRouter, Link } from 'react-router-dom'
import { IMG_URL } from '../utils/constants'
import { startLogout } from '../actions/auth'
import ButtonPrimary from './common/ButtonPrimary'
import ButtonOutline from './common/ButtonOutline'
import NavItem from './nav/NavItem'

class Header extends Component {
  handleLogin = () => {
    history.push('/login')
  }
  handleLogout = () => {
    const { startLogout, client } = this.props
    startLogout(history, client)
  }
  render() {
    const { auth } = this.props
    return (
      <div className="pa4 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/"><img src={`${IMG_URL}/logo/logo.svg`} style={{ width: '200px' }} /></Link>
          <span className="ba b--light-red f6 fw6 light-red ml3 br3 mt2" style={{ padding: '0px 4px' }}>Beta</span>
        </div>
        <div className="flex items-center">
          <NavItem to="/about">About</NavItem>
          <div>
            {auth.isAuthenticated ? 
              <ButtonOutline onClick={this.handleLogout}>Log out</ButtonOutline> :
              <ButtonPrimary onClick={this.handleLogin}>Login</ButtonPrimary>
            }
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ auth }) => ({ auth })

export default withRouter(connect(mapStateToProps, { startLogout })(withApollo(Header)))