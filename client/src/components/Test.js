import React, { Component } from 'react'
import { Formik, Form } from 'formik'
import Editor from './editor/Editor'
import Field from './common/Field'

class Test extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    return (
      <div className="pa4">
      <div className="mb4">
        <Formik>
          <Form>
          <Field name="test" type="text" autoFocus />
          </Form>
        </Formik>
        </div>
        <Editor tabIndex={0} style={{ minHeight: '80px' }} />
      </div>
    )
  }
}

Test.propTypes = {

}

export default Test