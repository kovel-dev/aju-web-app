import React, { useState, useRef, useEffect } from 'react'
import { server } from '../../lib/config/server'
import FormBuilder from '../../components/form/form-builder'
import { useRouter } from 'next/router'
import { validateUserForm } from '../../lib/validations/user-validations'
import {
  getUserByRefHandler,
  processUserForm,
} from '../../lib/handlers/handlers'
import Notification from '../../components/shared/notification'
import User from '../../lib/models/user'
import ResendEmailVerification from './resend-email-verification'
import Meta from '../meta'
import Loader from '../loader'

function UserFormBuilder(props) {
  let user = new User({})
  const router = useRouter()
  const isEdit = props.edit ? true : false
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [modelState, setModelState] = useState(user.getValues())
  const [showNotification, setShowNotification] = useState(false)
  const [schema, setSchema] = useState(User.getSchema(isEdit))
  const [notificationMsg, setNotificationMsg] = useState({
    variant: '',
    msg: '',
  })

  let url = `${server}/api/users/create`
  if (isEdit) {
    const query = router.query
    const refNumber = query.id
    url = `${server}/api/users/${refNumber}/edit`
  }

  useEffect(async () => {
    setIsLoading(true)

    if (isEdit) {
      const query = router.query

      if (query) {
        const refNumber = query.id
        await getUserByRefHandler(refNumber)
          .then((value) => {
            user = new User(value)
            setModelState(user)
            setSchema(User.getSchema(isEdit, user.role, user.is_verified))
            setIsLoading(false)
          })
          .catch(function (err) {
            console.log(err)
            setErrors(err.response.data)
            setIsLoading(false)
            return
          })
      }
    } else {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    setSchema(User.getSchema(isEdit, modelState.role, modelState.is_verified))
  }, [modelState])

  async function submitHandler(event) {
    event.preventDefault()
    setIsLoading(true)
    setErrors({})

    const enteredData = modelState
    await validateUserForm(enteredData)
      .then(async (value) => {
        await processUserForm(url, enteredData)
          .then((response) => {
            // Add success message
            if (isEdit) {
              setShowNotification(true)
              setNotificationMsg({
                variant: 'success',
                msg: 'Updated successfully',
              })
            } else {
              router.replace({
                pathname: `${server}/users`,
                query: { status: 'created' },
              })
            }
            setIsLoading(false)
          })
          .catch((error) => {
            setShowNotification(true)
            setNotificationMsg({
              variant: 'error',
              msg: 'Failed to create',
            })
            setErrors(error.response.data)
            setIsLoading(false)
          })
      })
      .catch(function (err) {
        setErrors(err)
        setIsLoading(false)
        return
      })
  }

  async function onClickResendEVHandler(event) {
    event.preventDefault()
    setIsLoading(true)
    setErrors({})
    const query = router.query
    const refNumber = query.id

    await processUserForm(
      `${server}/api/users/${refNumber}/resend-email-verification`
    )
      .then((response) => {
        // Add success message
        setShowNotification(true)
        setNotificationMsg({
          variant: 'success',
          msg: 'Email Verification Resent!',
        })
        setIsLoading(false)
      })
      .catch((error) => {
        setShowNotification(true)
        setNotificationMsg({
          variant: 'error',
          msg: 'Failed to resend email verification',
        })
        setErrors(error.response.data)
        setIsLoading(false)
      })
  }

  const closeNotification = () => {
    setShowNotification(false)
  }

  return (
    <>
      <Meta
        title={`${props.edit ? 'Edit ' : 'Add '}User | Maven Admin`}
        keywords=""
        description=""
      />

      {showNotification && (
        <Notification
          variant={notificationMsg.variant}
          msg={notificationMsg.msg}
          closeHandler={closeNotification}
        />
      )}

      {isLoading && <Loader />}

      {!isLoading && (
        <FormBuilder
          formSchema={schema}
          formSubmit={submitHandler}
          fieldValues={modelState}
          fieldValuesHandler={setModelState}
          errors={errors}
        />
      )}

      {!isLoading && modelState.is_verified !== true && props.edit && (
        <ResendEmailVerification
          onClickResendEmailVerification={onClickResendEVHandler}
        />
      )}
    </>
  )
}

export default UserFormBuilder
