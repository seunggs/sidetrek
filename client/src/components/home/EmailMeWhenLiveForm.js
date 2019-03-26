import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Formik, Form } from 'formik'
import Field from '../common/Field'
import * as Yup from 'yup'
import ButtonPrimary from '../common/ButtonPrimary'
import ButtonOutline from '../common/ButtonOutline'
import { parseServerErrors } from '../../utils/errors'
import FormErrorMessage from '../common/FormErrorMessage'
import { startCreateSubscriber } from '../../actions/subscriber'
import { startSendMail } from '../../actions/mail'
import { FROM_EMAIL } from '../../utils/constants'
import notification from '../common/notification'

const EmailMeWhenLiveSchema = Yup
  .object()
  .shape({
    name: Yup
      .string()
      .required('Name is required'),
    email: Yup
      .string()
      .email('Email is not valid')
      .required('Email is required'),
  })

class EmailMeWhenLive extends Component {
  constructor(props) {
    super(props)
    this.state = {
      submitError: ''
    }
  }

  render() {
    const { client, closeModal, project, startCreateSubscriber, startSendMail } = this.props
    return (
      <div>
        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validationSchema={EmailMeWhenLiveSchema}
          validateOnChange={false}
          onSubmit={async ({ name, email }, { setSubmitting, setFieldError, setStatus }) => {
            try {
              // Add this person to Drip
              await startCreateSubscriber(client, { email, customFields: { name }, tags: { set: [project] } })

              // Send notification to ourselves
              const emailContent = `${name} (${email}) showed interest in ${project}`
              await startSendMail(client, {
                to: { set: [email] },
                from: FROM_EMAIL,
                subject: `Someone showed interest in ${project} prelaunch!`,
                text: emailContent,
                html: emailContent,
              })

              setSubmitting(false)

              notification.open({ type: 'success', message: 'We got it!', description: 'We\'ll let you know when it\'s live!' })

              closeModal()
            } catch (errors) {
              const errorMessage = parseServerErrors(errors)
              setSubmitting(false)
              setFieldError('form', errorMessage)
            }
          }}
        >
          {({ isSubmitting, status }) => (
            <Form>
              <div className="f3 fw4 pv3">We'll let you know when it goes live. 👍</div>

              <div>
                <Field type="text" name="name" placeholder="Your full name" />
              </div>

              <div>
                <Field type="email" name="email" placeholder="Your email" />
              </div>

              <div className="tr">
                <ButtonPrimary type="submit" loading={isSubmitting}>Email me later</ButtonPrimary>
                <ButtonOutline className="ml2" onClick={closeModal}>Cancel</ButtonOutline>
              </div>
              <FormErrorMessage className="tr" />
            </Form>
          )}
        </Formik>
      </div>
    )
  }
}

export default connect(undefined, { startCreateSubscriber, startSendMail })(EmailMeWhenLive)