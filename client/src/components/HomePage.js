import React, { Component, Fragment } from 'react'
import * as R from 'ramda'
import { withApollo } from 'react-apollo'
import Header from './Header'
import Timeline from './common/Timeline'
import Icon from './common/Icon';
import { IMG_URL } from '../utils/constants'
import ButtonSecondary from './common/ButtonSecondary'
import { Default, Mobile } from './common/responsive'
import Modal from './common/Modal'
import EmailMeWhenLiveForm from './home/EmailMeWhenLiveForm'

class Expandable extends Component {
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
    const { closedHeight = '336px', children } = this.props
    const { open } = this.state

    return (
      <div className="flex flex-column justify-between">
        <div className="overflow-hidden mb4 pt2" style={{ transition: 'all 0.15s', transitionDelay: '0.1s', height: open ? '100%' : closedHeight }}>
          {children}
        </div>

        <div className="mb4 pointer" style={{ height: '80px' }} onClick={this.toggle}>
          <div className="f4 fw4 cobalt-blue flex items-center">
            <div className="mr2">See {open ? 'less' : 'more'}</div>
            <div style={{ color: '#0271e3', transition: 'all 0.15s', transform: open ? 'rotate(-90deg)' : 'rotate(0deg)' }}>&rarr;</div>
          </div>
        </div>
      </div>
    )
  }
}

const Benefit = ({ icon, iconColor, title, text, ...rest }) => (
  <div className="col-xs-12 col-md-4" {...rest}>
    <div className="ph3 mt5 mt0-ns tc">
      <div className="mb4"><Icon type={icon} theme="twoTone" twoToneColor={iconColor} style={{ fontSize: '60px' }} /></div>
      <div className="f3 dark-gray mb2">{title}</div>
      <div className="f4 gray">{text}</div>
    </div>
  </div>
)

class Milestone extends Component {
  render() {
    const { milestones } = this.props

    return (
      <div>
        <div className="f4 fw4 mb4">Set your own milestones (example below)</div>

        <div>
          <Timeline>
            {milestones.map((milestone, i) => {
              const { title: milestoneTitle, time: milestoneTime } = milestone
              return (
                <div key={i}>
                  <div><span>{milestoneTitle}</span> {milestoneTime ? <span className="i">({milestoneTime})</span> : null}</div>
                </div>
              )
            })}
          </Timeline>
        </div>
      </div>
    )
  }
}

const Project = ({ name, image, color, title, description, closedHeight, milestones, onClick, ...rest }) => {
  return (
    <div className={`relative ba b--${color} mt5`} style={{ borderWidth: '5px', borderRadius: '15px', minHeight: '510px' }} {...rest}>
      <div className="pa5">
        <Expandable closedHeight={closedHeight}>
          <div>
            <div className={`f2 fw4 mb3 lh-title near-black`}>{title}</div>
            <div className="f4 mb4">{description}</div>

            {milestones ? <Milestone milestones={milestones} /> : null}
          </div>
          <div className="absolute" style={{ bottom: '40px' }}>
            <ButtonSecondary
              block
              icon="mail"
              style={{ backgroundColor: '#444', borderColor: '#444' }}
              onClick={onClick}
            >
              Email me when it's live!
          </ButtonSecondary>
          </div>
        </Expandable>
      </div>
    </div>
  )
}

class HomePage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      project: null,
    }
  }

  benefits = [
    {
      icon: 'rocket',
      iconColor: '#f86288',
      title: 'Start a project',
      text: <div>Join others who are trying to achieve the same thing and benefit from each other's knowledge, experience, and support.</div>,
    },
    {
      icon: 'dashboard',
      iconColor: '#fec233',
      title: 'Set your own pace',
      text: <div>Create your own milestones and deadlines. The project's community and tools are just there to help you move things along. How you do it is completely up to you.</div>,
    },
    {
      icon: 'book',
      iconColor: '#6257f9',
      title: 'Not a course',
      text: <div>Sidetrek is a community, not a course. People use various resources to learn the skills and finish the project. Feel free to take courses anywhere else and discuss them freely here!</div>,
    },
  ]

  projects = [
    {
      name: 'build-an-e-commerce-site-with-reactjs-in-100-days',
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
    },
    {
      name: 'become-a-product-manager-in-100-days',
      image: `${IMG_URL}/illustrations/light-bulb-blue.png`,
      color: 'cobalt-blue',
      title: 'Become a Product Manager in 100 Days',
      description: <div>
        <p>
          Are you currently learning about product management to start a new career?
          Join others who have the same goals and make it happen!
        </p>
        <p>
          There is no one way to get there. Set your own milestones to achieve your goals. Connect
          with like-minded people to be encouraged throughout your journey.
        </p>
        <p>
          More details to come. Let us know if you’d like to hear more about this!
        </p>
      </div>,
    },
    {
      name: 'build-an-app-with-reactjs-graphql-apollo-prisma-in-100-days',
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
    },
    {
      name: 'lose-x-lbs-in-60-days',
      image: `${IMG_URL}/illustrations/light-bulb-pink.png`,
      color: 'aqua',
      title: 'Lose [your goal here] lbs in 60 days',
      description: <div>
        <p>This is NOT a community to set or discuss any standard of beauty or health.</p>
        <p>
          This is a community to help professionals to get back to a healthy body and mind.
          If you recently gained some weight due to stress and have been struggling to maintain a healthy lifestyle,
          this is the right place for you!
        </p>
        <p>
          If you’re a type of person who feels motivated to achieve
          goals by sharing them with others and getting encouragement, you’re at the right place.
        </p>
        <p>
          Set your own pace and celebrate milestones with others in the community.
        </p>
      </div>,
    },
  ]

  handleOpenModal = () => {
    this.setState({
      modalVisible: true,
    })
  }

  handleCloseModal = () => {
    this.setState({
      modalVisible: false,
    })
  }

  handleEmailMeWhenLiveClick = projectName => {
    this.setState(() => ({ project: projectName }), () => {
      this.handleOpenModal()
    })
  }

  render() {
    const { client } = this.props
    const { modalVisible, project } = this.state

    return (
      <div>
        <Header />

        {/* hero */}
        <div className="container-narrow pt5 pb3 pb4-ns">
          <div className="row tc">
            <div className="col-xs-12">
              <div className="relative">
                <div className="f-subheadline f-headline-l fw4 lh-title lh-solid-ns near-black">
                  <span>Are you an <i className="homepage-title">infinite learner</i>?</span>
                </div>
              </div>
              <h1 className="f2 f1-ns mt4 gray fw4 lh-title">Join us to kickstart your passion project, start a new career, or just dabble in new interests 👍</h1>
            </div>
          </div>
        </div>
        {/* end: hero */}

        {/* how it works */}

        <div className="container-main pv4">
          <div className="row">
            {this.benefits.map(({ icon, iconColor, title, text }, i) => (
              <Benefit key={i} icon={icon} iconColor={iconColor} title={title} text={text} />
            ))}
          </div>
        </div>
        {/* end: how it works */}

        {/* projects */}
        <div className="container-main pb6">
          <div className="row">
            {this.projects.map((project, i) => {
              const { name, color, image, title, description, closedHeight, milestones } = project
              return (
                <Fragment key={i}>
                  <div className="col-xs-12 col-md-6">
                    <Project
                      name={name}
                      color={color}
                      image={image}
                      title={title}
                      description={description}
                      closedHeight={closedHeight}
                      milestones={milestones}
                      onClick={e => this.handleEmailMeWhenLiveClick(name)}
                    />
                  </div>
                  {/* Survey insertion */}
                  {i === 1 &&
                    <div className="col-xs-12 mt5">
                      <div className="pa5 bg-dark-gray white" style={{ borderWidth: '5px', borderRadius: '15px' }}>
                        {/* <Default>
                          <div className="flex">
                            <div className="pr5"><Icon type="bulb" style={{ color: '#fff', fontSize: '60px' }} /></div>
                            <div>
                              <div className="f2 fw4 mb2">Send us your ideas!</div>
                              <div className="f4 fw4 mb3">What short-term goals do you want to achieve at Sidetrek?</div>
                              <div className="f4 fw4 mb4">What communities would you like to create or join?</div>
                              <div>
                                <ButtonSecondary href="https://seungchanlee.typeform.com/to/RJnRqS" target="_blank" style={{ color: 'black', backgroundColor: '#fff', borderColor: '#fff' }}>Let us know</ButtonSecondary>
                              </div>
                            </div>
                          </div>
                        </Default> */}
                        {/* <Mobile> */}
                          <div className="flex flex-column items-center">
                            <div className="mb4"><Icon type="bulb" style={{ color: '#fff', fontSize: '60px' }} /></div>
                            <div className="tc">
                              <div className="f2 fw4 mb2">Send us your ideas!</div>
                              <div className="f4 fw4 mb3">What short-term goals do you want to achieve at Sidetrek?</div>
                              <div className="f4 fw4 mb4">What communities would you like to create or join?</div>
                              <div>
                                <ButtonSecondary style={{ color: 'black', backgroundColor: '#fff', borderColor: '#fff' }}>Submit a project idea</ButtonSecondary>
                              </div>
                            </div>
                          </div>
                        {/* </Mobile> */}
                      </div>
                    </div>
                  }
                  {/* end: Survey insertion */}
                </Fragment>
              )
            })}
          </div>
        </div>
        {/* end: projects */}

        {/* modal */}
        <Modal
          visible={modalVisible}
          onCancel={this.handleCloseModal}
          footer={null}
        >
          <EmailMeWhenLiveForm client={client} project={project} closeModal={this.handleCloseModal} />
        </Modal>
        {/* end: modal */}
      </div>
    )
  }
}

export default withApollo(HomePage)