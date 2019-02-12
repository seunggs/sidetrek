import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import logger from '../../utils/logger';

/**
 * EditableText uses Formik Form and Field underneath
 * i.e. onSubmit flows through all arguments to the parent
 */

class EditableText extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isEditing: false,
      submitError: '',
    }
  }

  handleCancelClick = e => {
    this.setState(() => ({ isEditing: false }))
  }

  handleTextClick = e => {
    this.setState(() => ({ isEditing: true }))
  }

  render() {
    const {
      isEditable = false,
      name,
      type = 'text',
      onSubmit,
      validate = null,
      children,
      ...rest
    } = this.props
    const isChildrenReactElement = React.isValidElement(children)

    return (
      <Fragment {...rest}>
        {isEditable && this.state.isEditing ?
          <Formik
            initialValues={{
              [name]: isChildrenReactElement ? children.props.children : children
            }}
            onSubmit={onSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <div>
                  <Field
                    type={type}
                    name={name}
                    validate={validate}
                  />
                  <button type="submit" disabled={isSubmitting}>Submit</button>
                  <button type="button" onClick={this.handleCancelClick}>Cancel</button>
                </div>
                <ErrorMessage name={name} component="div" />
              </Form>
            )}
          </Formik> :
          <div onClick={this.handleTextClick}>{children} {isEditable && <span className="ml2 gray underline">Edit</span>}</div>
        }
      </Fragment>
    )
  }
}

EditableText.propTypes = {
  isEditable: PropTypes.bool,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string
  ]),
  validate: PropTypes.func,
}

export default EditableText