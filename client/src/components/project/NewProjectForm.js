import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Formik, Form } from 'formik'
import Field from '../common/Field'
import * as Yup from 'yup'
import { ApolloConsumer } from 'react-apollo'
import ButtonPrimary from '../common/ButtonPrimary'
import { parseServerErrors } from '../../utils/errors'
import { startCreateProject } from '../../actions/project'
import FormErrorMessage from '../common/FormErrorMessage'

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

class NewProjectForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      submitErrors: '',
    }
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
              validationSchema={NewProjectSchema} // handles sync validations
              onSubmit={async ({ title, description }, { setSubmitting, setFieldError }) => {
                const projectData = {
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
                  await startCreateProject(client, projectData)
                  setSubmitting(false)
                  history.replace('/project/new/milestones')
                } catch (errors) {
                  const errorMessage = parseServerErrors(errors)
                  setSubmitting(false)
                  setFieldError('form', errorMessage)
                }
              }}>
              {({ values, isSubmitting }) => (
                <div className="row pv5">
                  <div className="col-xs-12 col-md-4 col-md-offset-4">
                    <div className="f3 fw4 mb3">Create a new project</div>

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

export default withRouter(connect(mapStateToProps, { startCreateProject })(NewProjectForm))