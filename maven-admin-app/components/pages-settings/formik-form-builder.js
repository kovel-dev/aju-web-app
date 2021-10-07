import React, { useState } from 'react'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import BaseFormikFormBuilder from '../form/formik-form-builder'
import * as Yup from 'yup'
import { server } from '../../lib/config/server'
import Notification from '../shared/notification'
import HomepageModel from '../../lib/models/pages/home'
import Meta from '../meta'

function FormBuilder(props) {
  const [showFlashMsg, setShowFlashMsg] = useState(false)
  const [notificationMsg, setNotificationMsg] = useState({
    variant: '',
    msg: '',
  })

  const pageKey = props.pageKey
  const initialValues = props.initialValues
  const formValidationSchema = props.validationSchema
  const formSchema = props.formSchema

  // Perform Save function
  const submitHandler = async (values, { setSubmitting }) => {
    let url = `${server}/api/content/save`
    const res = await fetch(url, {
      body: JSON.stringify({
        page: pageKey,
        pageData: values,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })

    const result = await res.json()

    setShowFlashMsg(true)
    if (res.status === 200) {
      setNotificationMsg({
        variant: 'success',
        msg: result[0].msg,
      })
      setSubmitting(false)
    } else {
      setShowFlashMsg(true)
      setNotificationMsg({
        variant: 'error',
        msg: res.msg,
      })
      setSubmitting(false)
    }
  }

  const closeFlashMsg = () => {
    setShowFlashMsg(false)
  }

  return (
    <>
      <Meta
        title="Edit Pages and Settings | Maven Admin"
        keywords=""
        description=""
      />
      {showFlashMsg && (
        <Notification
          variant={notificationMsg.variant}
          msg={notificationMsg.msg}
          closeHandler={closeFlashMsg}
        />
      )}
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        validationSchema={Yup.object(formValidationSchema)}
        onSubmit={submitHandler}
      >
        {(formik) => {
          return (
            <Form className="space-y-8 divide-y divide-gray-200">
              <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                <div className="form-section-holder">
                  <BaseFormikFormBuilder schema={formSchema} />
                  <div className="pt-5">
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className={`ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark ${
                          !formik.isValid || formik.isSubmitting
                            ? 'bg-gray-400'
                            : 'bg-primary hover:bg-primary-dark'
                        }`}
                        disabled={!formik.isValid || formik.isSubmitting}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          )
        }}
      </Formik>
    </>
  )
}

export default FormBuilder
