import React, { Component } from 'react'
import { withApollo } from 'react-apollo'
import { connect } from 'react-redux'
import { history } from '../App'
import { withRouter, Link } from 'react-router-dom'
import { startLogout } from '../actions/auth'
import ButtonPrimary from './common/ButtonPrimary'
import ButtonOutline from './common/ButtonOutline'
import NavItem from './nav/NavItem'
import { ReactComponent as Logo } from '../images/logo/logo.svg'
import { Default, Mobile } from './common/responsive'

class Header extends Component {
  navItems = [
    { to: '/about', title: 'About' }
  ]
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
      <div className="container-wide">
        <div className="row">
          <div className="col-xs-12">
            <Default>
              <div className="pv4 flex justify-between items-center">
                <div className="flex items-center">
                  <Link to="/"><Logo style={{ width: '200px' }} /></Link>
                  <span className="ba b--light-red f6 fw4 light-red ml3 br3" style={{ padding: '0px 4px' }}>Beta</span>
                </div>
                <div className="flex items-center">
                  {this.navItems.map(({ to, title }) => <NavItem key={to} to={to}>{title}</NavItem>)}
                  <div>
                    {auth.isAuthenticated ?
                      <ButtonOutline onClick={this.handleLogout}>Log out</ButtonOutline> :
                      <ButtonPrimary onClick={this.handleLogin}>Login</ButtonPrimary>
                    }
                  </div>
                </div>
              </div>
            </Default>
            <Mobile>
              <div className="pv4 flex justify-between items-center">
                <div className="flex items-center justify-between w-100">
                  <div className="flex items-center">
                    <Link to="/"><Logo style={{ width: '140px' }} /></Link>
                    <span className="ba b--light-red f6 fw4 light-red ml3 br3" style={{ padding: '0px 4px' }}>Beta</span>
                  </div>
                  <div className="flex items-center">
                    {this.navItems.map(({ to, title }) => <NavItem key={to} to={to} style={{ paddingTop: '1.2rem', marginLeft: '1.5rem', marginRight: '1.5rem' }}>{title}</NavItem>)}
                    <div>
                      {auth.isAuthenticated ?
                        <ButtonOutline onClick={this.handleLogout}>Log out</ButtonOutline> :
                        <ButtonPrimary onClick={this.handleLogin}>Login</ButtonPrimary>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </Mobile>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ auth }) => ({ auth })

export default withRouter(connect(mapStateToProps, { startLogout })(withApollo(Header)))