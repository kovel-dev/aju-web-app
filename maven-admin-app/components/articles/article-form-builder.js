import React, { useState, useRef, useEffect } from 'react'
import { server } from '../../lib/config/server'
import FormBuilder from '../form/form-builder'
import { useRouter } from 'next/router'
import { hasError, getErrorMessage } from '../../lib/validations/validations'
import { validateArticleForm } from '../../lib/validations/article-validations'
import { getArticleByRef, processUserForm } from '../../lib/handlers/handlers'
import Notification from '../shared/notification'
import Article from '../../lib/models/article'
import Meta from '../meta'

const ArticleFormBuilder = ({ edit }) => {
  let article = new Article({})
  const isEdit = edit ? true : false
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [modalState, setModalState] = useState(article.getValues())
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMsg, setNotificationMsg] = useState({
    variant: '',
    msg: '',
  })

  const router = useRouter()
  const fieldValues = {}
  //Get Model Schema
  const schema = Article.getSchema(isEdit)

  let url = `${server}/api/articles/create`
  if (isEdit) {
    const query = router.query
    const refNumber = query.id
    url = `${server}/api/articles/${refNumber}/edit`
  }

  //Tag Edit
  if (isEdit) {
    useEffect(async () => {
      setIsLoading(true)
      const query = router.query

      if (query) {
        const refNumber = query.id
        await getArticleByRef(refNumber)
          .then((value) => {
            article = new Article(value)
            setModalState(article)
            setIsLoading(false)
          })
          .catch(function (err) {
            console.log('Error: ', err)
            setErrors(err.response.data)
            setIsLoading(false)
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
    await validateArticleForm(enteredData)
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
                pathname: `${server}/articles`,
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
        title={`${edit ? 'Edit ' : 'Add '}Article | Maven Admin`}
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

export default ArticleFormBuilder
