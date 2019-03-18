import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Formik, Form } from 'formik'
import Field from '../common/Field'
import * as Yup from 'yup'
import { ApolloConsumer } from 'react-apollo'
import ButtonPrimary from '../common/ButtonPrimary'
import { parseServerErrors } from '../../utils/errors'
import { validateProjectName } from '../../utils/validators'
import { createPermalink } from '../../utils/common'
import { startCreateProject } from '../../actions/project'
import FormErrorMessage from '../common/FormErrorMessage'

const NewMilestoneSchema = Yup
  .object()
  .shape({
    title: Yup
      .string()
      .required('Title is required'),
    description: Yup
      .string()
      .required('Description is required'),
  })

class NewMilestoneForm extends Component {
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
    const { user, startCreateProject, history } = this.props

    return (
      <Fragment>
        <ApolloConsumer>
          {client => (
            <Formik
              initialValues={{
                title: '',
                description: '',
              }}
              validateOnChange={false}
              validationSchema={NewMilestoneSchema} // handles sync validations
              onSubmit={async ({ title, description }, { setSubmitting, setFieldError }) => {
                const name = createPermalink(title)
                const projectData = {
                  name,
                  url: name,
                  title,
                  description,
                  author: {
                    connect: {
                      email: user.email
                    }
                  },
                  members: {
                    create: [{
                      user: {
                        connect: {
                          email: user.email
                        }
                      },
                      role: 'ADMIN',
                    }]
                  },
                }

                try {
                  const newProject = await startCreateProject(client, projectData)
                  setSubmitting(false)
                  history.replace('/')
                } catch (errors) {
                  const errorMessage = parseServerErrors(errors)
                  setSubmitting(false)
                  setFieldError('form', errorMessage)
                }
              }}>
              {({ isSubmitting }) => (
                <div className="row pv5">
                  <div className="col-xs-12 col-md-4 col-md-offset-4">
                    <div className="f3 fw6 mb3">Create a new milestone</div>

                    <Form noValidate>
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
                        <ButtonPrimary type="submit" className="mt2" loading={isSubmitting}>Create Project</ButtonPrimary>
                      </div>
                      <FormErrorMessage />
                    </Form>
                  </div>
                </div>
              )}
            </Formik>
          )}
        </ApolloConsumer>
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user,
})

export default withRouter(connect(mapStateToProps, { startCreateProject })(NewMilestoneForm))