import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Formik, Form } from 'formik'
import Field from '../common/Field'
import * as Yup from 'yup'
import { ApolloConsumer } from 'react-apollo'
import ButtonPrimary from '../common/ButtonPrimary'
import { parseServerErrors } from '../../utils/errors'
import { validateProjectName } from '../../utils/validators'
import { createPermalink } from '../../utils/common'

const NewProjectSchema = Yup
  .object()
  .shape({
    title: Yup
      .string()
      .required('Title is required'),
    description: Yup
      .string()
      .required('Description is required'),
  })

class NewProjectPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isValidatingName: false,
      nameAvailable: null,
      submitErrors: '',
    }
  }

  setValidatingName = value => {
    // Set loading status while async validating
    this.setState(() => ({ isValidatingName: value }))
  }

  validateName = (name, client) => {
    this.setState(() => ({ nameAvailable: null }))
    return validateProjectName({ name, client, setValidatingName: this.setValidatingName })
      .then(() => this.setState(() => ({ nameAvailable: true })))
  }

  render() {
    return (
      <Fragment>
        <ApolloConsumer>
          {client => (
            <Formik
              initialValues={{
                name: '',
                title: '',
                description: '',
              }}
              validateOnChange={false}
              validationSchema={NewProjectSchema} // handles sync validations
              onSubmit={this.handleSubmit}>
              {({ values, isSubmitting, setFieldValue }) => (
                <Fragment>
                  <div>Create a new project</div>

                  <Form noValidate>
                    <div>
                      <Field
                        name="name"
                        placeholder="Project name"
                        addonBefore="https://sidetrek.com/" 
                        validate={name => this.validateName(name, client)}
                      />
                    </div>

                    <div>
                      <Field
                        name="title"
                        placeholder="Project title"
                      />
                    </div>

                    <div>
                      <Field
                        name="description"
                        placeholder="Project description"
                      />
                    </div>

                    <div>
                      <Field
                        name="body"
                        placeholder="Write more information about the project here"
                      />
                    </div>

                    <div>
                      <ButtonPrimary type="submit" loading={isSubmitting}>Create Project</ButtonPrimary>
                    </div>
                  </Form>
                </Fragment>
              )}
            </Formik>
          )}
        </ApolloConsumer>
      </Fragment>
    )
  }
}

export default connect(undefined, {})(NewProjectPage)