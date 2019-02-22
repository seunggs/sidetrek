import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import logger from '../../utils/logger'
import ButtonPrimary from './ButtonPrimary';

/**
 * Usage: 
 *   - Children are assumed to be steps, except for the 'prev' and 'next' Components
 *   - N.B. Must have 'prev' and 'next' components (i.e. attribute of name="prev" and name="next")
 * 
  <Stepper>
    <div>1</div>
    <div>2</div>
    <div>3</div>
    <ButtonPrimary name="prev">Prev</ButtonPrimary>
    <ButtonPrimary name="next">Next</ButtonPrimary>
  </Stepper>
 */

class Stepper extends Component {
  constructor(props) {
    super(props)
    const { initialStep = 1 } = this.props
    this.state = {
      step: initialStep
    }
  }

  getActiveComponent = step => {
    return this.props.children[step - 1]
  }

  handlePrevClick = e => {
    const currentStep = this.state.step
    const newStep = currentStep > 1 ? currentStep - 1 : currentStep
    this.setState(() => ({ step: newStep }))
  }

  handleNextClick = e => {
    const currentStep = this.state.step
    const maxStep = this.props.children.length - 2 // excluding buttons
    const newStep = currentStep < maxStep ? currentStep + 1 : currentStep
    this.setState(() => ({ step: newStep }))
  }

  render() {
    const { children } = this.props
    const step = this.state.step
    const activeComponent = this.getActiveComponent(step)
    
    const prevButton = children.find(({ props }) => props.name === 'prev')
    const finalPrevButton = React.cloneElement(prevButton, { onClick: this.handlePrevClick })
    const nextButton = children.find(({ props }) => props.name === 'next')
    const finalNextButton = React.cloneElement(nextButton, { onClick: this.handleNextClick })

    return (
      <Fragment>
        {activeComponent}
        {step > 1 ? finalPrevButton : null}
        {step < (children.length - 2) ? finalNextButton : null}
      </Fragment>
    )
  }
}

Stepper.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element).isRequired,
  initialStep: PropTypes.number,
}

export default Stepper