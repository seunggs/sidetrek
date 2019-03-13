import React, { Component, Fragment } from 'react'
import Header from './Header'
import Timeline from './common/Timeline'
import Icon from './common/Icon';
import { IMG_URL } from '../utils/constants'
import ButtonSecondary from './common/ButtonSecondary'

const Benefit = ({ icon, iconColor, title, text, ...rest }) => (
  <div className="col-xs-12 col-md-4" {...rest}>
    <div className="ph3 tc">
      <div className="mb4"><Icon type={icon} theme="twoTone" twoToneColor={iconColor} style={{ fontSize: '60px' }} /></div>
      <div className="f3 fw6 dark-gray mb2">{title}</div>
      <div className="f4 fw4 gray">{text}</div>
    </div>
  </div>
)

class Milestone extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false
    }
  }

  toggle = e => {
    this.setState(state => ({ open: !state.open }))
  }

  render() {
    const { milestones, openHeight = '320px', closedHeight = '100px' } = this.props
    const { open } = this.state

    return (
      <div>
        <div className="overflow-hidden mb4" style={{ transition: 'all 0.15s', transitionDelay: '0.1s', height: open ? openHeight : closedHeight }}>
          <Timeline>
            {milestones.map((milestone, i) => {
              const { title: milestoneTitle, time: milestoneTime } = milestone
              return (
                <div key={i}>
                  <div><span className="fw5">{milestoneTitle}</span> {milestoneTime ? <span className="i">({milestoneTime})</span> : null}</div>
                </div>
              )
            })}
          </Timeline>
        </div>

        <div className="mb4 pointer" onClick={this.toggle}>
          {/* <Icon type="right" style={{ color: '#0271e3', transition: 'all 0.15s', transform: open ? 'rotate(90deg)' : 'rotate(0)' }} /> */}
          <div className="f4 fw5 cobalt-blue flex items-center">
            <div className="mr2">See {open ? 'less' : 'more'}</div>
            <div style={{ color: '#0271e3', transition: 'all 0.15s', transform: open ? 'rotate(-90deg)' : 'rotate(0deg)' }}>&rarr;</div>
          </div>
        </div>
      </div>
    )
  }
}

const Project = ({ image, color, title, description, openHeight, closedHeight, milestones, ...rest }) => {
  return (
    <div className={`ba b--${color} overflow-hidden mt5`} style={{ borderWidth: '5px', borderRadius: '15px' }} {...rest}>
      <div className="pa5">
        {/* <div className="mb4" style={{ background: `url(${image})`, backgroundSize: 'cover', height: '240px' }} /> */}
        <div className={`fw7 mb3 lh-title near-black`} style={{ fontSize: '2.8rem' }}>{title}</div>
        <div className="f4 mb4">{description}</div>

        <div className="f4 fw7 mb4">Set your own milestones (example below)</div>

        <Milestone milestones={milestones} openHeight={openHeight} closedHeight={closedHeight} />

        <ButtonSecondary icon="mail" style={{ backgroundColor: '#444', borderColor: '#444' }}>Email me when it's live!</ButtonSecondary>
      </div>
    </div>
  )
}

const HomePage = () => {
  const benefits = [
    {
      icon: 'rocket',
      iconColor: '#f86288',
      title: 'Start a project',
      text: <div>Join others who are trying to achieve the same thing and benefit from each other's knowledge, experience, and support</div>,
    },
    {
      icon: 'dashboard',
      iconColor: '#fec233',
      title: 'Set your own pace',
      text: <div>Create your own milestones and your own deadlines - the project's community and tools are just there to help you move things along. How you do it is completely up to you.</div>,
    },
    {
      icon: 'book',
      iconColor: '#6257f9',
      title: 'Not a course',
      text: <div>Sidetrek is a community, not a class or course you take. But feel free to take courses anywhere else and discuss them freely here!</div>,
    },
  ]

  const projects = [
    {
      image: `${IMG_URL}/illustrations/light-bulb-red.png`,
      color: 'coral',
      title: 'Build an E-commerce Site with ReactJS in 100 Days',
      description: `Use ReactJS to build a e-commerce site with cart, 
        checkout (Stripe).`,
      milestones: [
        { title: 'App scaffolding', time: '14 days' },
        { title: 'Authentication/account', time: '14 days' },
        { title: 'Product/sku/cart-item creation', time: '10 days' },
        { title: 'Shopping cart', time: '10 days' },
        { title: 'Checkout', time: '14 days' },
        { title: 'Fulfillment, invoicing, tracking', time: '14 days' },
        { title: 'Marketing pages and design', time: '14 days' },
        { title: 'UI/UX testing and deployment', time: '10 days' },
      ],
      openHeight: '320px',
      closedHeight: '100px',
    },
    {
      image: `${IMG_URL}/illustrations/light-bulb-blue.png`,
      color: 'cobalt-blue',
      title: 'Become a Product Manager in 100 Days',
      description: `Use ReactJS to build a e-commerce site with cart, 
        checkout (Stripe).`,
      milestones: [
        { title: 'App scaffolding', time: '14 days' },
        { title: 'Authentication/account', time: '14 days' },
        { title: 'Product/sku/cart-item creation', time: '10 days' },
        { title: 'Shopping cart', time: '10 days' },
        { title: '...', time: '' },
        { title: 'Checkout', time: '14 days' },
        { title: 'Fulfillment, invoicing, tracking', time: '14 days' },
        { title: 'Marketing pages and design', time: '14 days' },
        { title: 'UI/UX testing and deployment', time: '10 days' },
      ],
      openHeight: '320px',
      closedHeight: '100px',
    },
    {
      image: `${IMG_URL}/illustrations/light-bulb-yellow.png`,
      color: 'lemon',
      title: 'Build an App with ReactJS & GraphQL (Apollo/Prisma) in 100 Days',
      description: `Use ReactJS and GraphQL (Apollo/Prisma) to build a working app.`,
      milestones: [
        { title: 'App scaffolding with React/Node/Prisma', time: '14 days' },
        { title: 'Authentication/account with GraphQL/Apollo', time: '14 days' },
        { title: 'Private/public/admin routing', time: '7 days' },
        { title: 'Data model with GraphQL', time: '14 days' },
        { title: 'UI', time: '10 days' },
        { title: 'Marketing pages and design', time: '14 days' },
        { title: 'UI/UX testing and deployment', time: '10 days' },
      ],
      openHeight: '280px',
      closedHeight: '100px',
    },
    {
      image: `${IMG_URL}/illustrations/light-bulb-pink.png`,
      color: 'aqua',
      title: 'Build an E-commerce Site with ReactJS in 100 Days',
      description: `Use ReactJS to build a e-commerce site with cart, 
        checkout (Stripe).`,
      milestones: [
        { title: 'App scaffolding', time: '14 days' },
        { title: 'Authentication/account', time: '14 days' },
        { title: 'Product/sku/cart-item creation', time: '10 days' },
        { title: 'Shopping cart', time: '10 days' },
        { title: '...', time: '' },
        // { title: 'Checkout', time: '14 days' },
        // { title: 'Fulfillment, invoicing, tracking', time: '14 days' },
        // { title: 'Marketing pages and design', time: '14 days' },
        // { title: 'UI/UX testing and deployment', time: '10 days' },
      ],
      openHeight: '320px',
      closedHeight: '100px',
    },
  ]

  return (
    <div>
      <Header />

      {/* hero */}
      <div className="container-narrow pt5 pb3 pb4-ns">
        <div className="row">
          <div className="col-xs-12">
            <div className="relative">
              {/* <div><img src={`${IMG_URL}/illustrations/infinite-learner-2-mobile.svg`} style={{ width: '100%' }} /></div> */}
              <div className="f-subheadline f-headline-l fw7 lh-title lh-solid-ns near-black">
                {/* <span>Are you an <i style={{ background: 'linear-gradient(0deg, #ffe19a 50%, transparent 50%)' }}>infinite learner</i>?</span> */}
                <span>Are you an <i className="homepage-title">infinite learner</i>?</span>
              </div>
            </div>
            <h1 className="f2 f1-ns mt4 gray lh-title">Join us to kickstart your passion project, start a new career, or just dabble in new interests 👍</h1>
          </div>
        </div>
      </div>
      {/* end: hero */}

      {/* how it works */}

      <div className="container-main pv4">
        <div className="row">
          {benefits.map(({ icon, iconColor, title, text }, i) => (
            <Benefit key={i} icon={icon} iconColor={iconColor} title={title} text={text} />
          ))}
        </div>
      </div>
      {/* end: how it works */}

      {/* projects */}
      <div className="container-main">
        <div className="row">
          {projects.map((project, i) => {
            const { image, color, title, description, milestones, openHeight, closedHeight } = project
            return (
              <div key={i} className="col-xs-12 col-md-6">
                <Project
                  color={color} 
                  image={image} 
                  title={title} 
                  description={description} 
                  milestones={milestones} 
                  openHeight={openHeight}
                  closedHeight={closedHeight}
                />
              </div>
            )
          })}
        </div>
      </div>
      {/* end: projects */}
    </div>
  )
}

export default HomePage