import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Formik, Form } from 'formik'
import Field from '../common/Field'
import * as Yup from 'yup'
import { ApolloConsumer } from 'react-apollo'
import ButtonPrimary from '../common/ButtonPrimary'
import { parseServerErrors } from '../../utils/errors'
import { createPermalink } from '../../utils/common'
import { startCreateMilestone } from '../../actions/milestone'
import FormErrorMessage from '../common/FormErrorMessage'

const NewMilestoneSchema = Yup
  .object()
  .shape({
    title: Yup
      .string()
      .required('Title is required'),
    deadline: Yup
      .string()
      .required('Deadline is required'),
  })

class NewMilestoneForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      submitErrors: '',
    }
  }

  render() {
    const { user, startCreateMilestone, history } = this.props

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
                const milestoneData = {
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
                  const newMilestone = await startCreateMilestone(client, milestoneData)
                  console.log('newMilestone', newMilestone)
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
                  <div className="col-xs-12 col-md-6 col-md-offset-3">
                    <div className="f3 fw4 mb3">Create a new milestone</div>
                    
                    {/* heading */}
                    <div className="row">
                        <div className="col-xs-12 col-md-4"><span className="fw4">Title</span></div>
                        <div className="col-xs-12 col-md-4"><span className="fw4">Deadline</span></div>
                    </div>
                    {/* end: heading */}

                    <Form noValidate>
                      <div className="row">
                        <div className="col-xs-12 col-md-4">
                          <Field
                            name="title"
                            placeholder="Milestone title"
                          />
                        </div>
                        <div className="col-xs-12 col-md-4">
                          <Field
                            name="deadline"
                            placeholder="Milestone deadline"
                          />
                        </div>
                        <div className="col-xs-12 col-md-4">
                          <ButtonPrimary type="submit" loading={isSubmitting}>Add a milestone</ButtonPrimary>
                        </div>
                        <FormErrorMessage />
                      </div>

                      
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

export default withRouter(connect(mapStateToProps, { startCreateMilestone })(NewMilestoneForm))