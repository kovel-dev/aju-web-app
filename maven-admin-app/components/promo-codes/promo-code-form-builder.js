import React, { useState, useRef, useEffect } from 'react'
import { server } from '../../lib/config/server'
import FormBuilder from '../../components/form/form-builder'
import { useRouter } from 'next/router'
import { hasError, getErrorMessage } from '../../lib/validations/validations'
import { validatePromoCodeForm } from '../../lib/validations/promo-code-validations'
import { getPromoCodeByRef, processUserForm } from '../../lib/handlers/handlers'
import Notification from '../../components/shared/notification'
import PromoCode from '../../lib/models/promo-code'
import Meta from '../meta'

function PromoCodeFormBuilder(props) {
  let promoCode = new PromoCode({})
  const isEdit = props.edit ? true : false
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [modalState, setModalState] = useState(promoCode.getValues())
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMsg, setNotificationMsg] = useState({
    variant: '',
    msg: '',
  })

  const router = useRouter()
  const fieldValues = {}
  //Get Model Schema
  const schema = PromoCode.getSchema(isEdit)

  let url = `${server}/api/promo-codes/create`
  if (isEdit) {
    const query = router.query
    const refNumber = query.id
    url = `${server}/api/promo-codes/${refNumber}/edit`
  }

  //PromoCode Edit
  if (isEdit) {
    useEffect(async () => {
      setIsLoading(true)
      const query = router.query

      if (query) {
        const refNumber = query.id
        await getPromoCodeByRef(refNumber)
          .then((value) => {
            promoCode = new PromoCode(value)
            setModalState(promoCode)
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
    await validatePromoCodeForm(enteredData)
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
                pathname: `${server}/promo-codes`,
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
        title={`${props.edit ? 'Edit ' : 'Add '}Promo Code | Maven Admin`}
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

export default PromoCodeFormBuilder
