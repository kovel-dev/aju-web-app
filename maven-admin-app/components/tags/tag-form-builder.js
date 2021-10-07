import React, { useState, useEffect } from 'react'
import { server } from '../../lib/config/server'
import FormBuilder from '../../components/form/form-builder'
import { useRouter } from 'next/router'
import { validateTagForm } from '../../lib/validations/tag-validations'
import { getTagByRef, processUserForm } from '../../lib/handlers/handlers'
import Notification from '../../components/shared/notification'
import Tag from '../../lib/models/tag'
import Meta from '../meta'

function TagFormBuilder(props) {
  let tag = new Tag({})
  const isEdit = props.edit ? true : false
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [modalState, setModalState] = useState(tag.getValues())
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMsg, setNotificationMsg] = useState({
    variant: '',
    msg: '',
  })

  const router = useRouter()
  //Get Model Schema
  const schema = Tag.getSchema(isEdit)

  let url = `${server}/api/tags/create`
  if (isEdit) {
    const query = router.query
    const refNumber = query.id
    url = `${server}/api/tags/${refNumber}/edit`
  }

  //Tag Edit
  if (isEdit) {
    useEffect(async () => {
      setIsLoading(true)
      const query = router.query

      if (query) {
        const refNumber = query.id
        await getTagByRef(refNumber)
          .then((value) => {
            tag = new Tag(value)
            setModalState(tag)
            setIsLoading(false)
          })
          .catch(function (err) {
            setErrors(err.response.data)
            setIsLoading(false)
            console.log(err)
            return
          })
      }
    }, [])
  }

  async function submitHandler(event) {
    event.preventDefault()
    setIsLoading(true)
    setErrors({})

    const enteredData = modalState
    await validateTagForm(enteredData)
      .then(async () => {
        await processUserForm(url, enteredData)
          .then(() => {
            // Add success message
            if (isEdit) {
              setShowNotification(true)
              setNotificationMsg({
                variant: 'success',
                msg: 'Updated successfully',
              })
            } else {
              router.replace({
                pathname: `${server}/tags`,
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

  const closeNotification = () => {
    setShowNotification(false)
  }

  return (
    <>
      <Meta
        title={`${props.edit ? 'Edit ' : 'Add '}Tag | Maven Admin`}
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

      {!isLoading && (
        <FormBuilder
          formSchema={schema}
          formSubmit={submitHandler}
          fieldValues={modalState}
          fieldValuesHandler={setModalState}
          errors={errors}
        />
      )}
    </>
  )
}

export default TagFormBuilder
