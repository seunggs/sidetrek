import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Formik, Form } from 'formik'
import Field from '../common/Field'
import * as Yup from 'yup'
import { ApolloConsumer } from 'react-apollo'
import ButtonPrimary from '../common/ButtonPrimary'
import { parseServerErrors } from '../../utils/errors'
import { createPermalink } from '../../utils/common'

const NewPostSchema = Yup
  .object()
  .shape({
    title: Yup
      .string()
      .required('Title is required'),
    body: Yup
      .string()
      .required('Post content is required'),
  })

class NewPostPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      submitErrors: '',
    }
  }

  render() {
    return (
      <Fragment>
        <ApolloConsumer>
          {client => (
            <Formik
              initialValues={{
                title: '',
                body: '',
              }}
              validateOnChange={false}
              validationSchema={NewPostSchema} // handles sync validations
              onSubmit={this.handleSubmit}>
              {({ values, isSubmitting, setFieldValue }) => (
                <Fragment>
                  <div>Create a new post</div>

                  <Form noValidate>
                    <div>
                      <Field
                        name="title"
                        placeholder="Post title"
                      />
                    </div>

                    <div>
                      <Field
                        name="body"
                        placeholder="Post body"
                      />
                    </div>

                    <div>
                      <ButtonPrimary type="submit" loading={isSubmitting}>Create Post</ButtonPrimary>
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

export default connect(undefined, {})(NewPostPage)