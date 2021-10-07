import React, { useState, useRef, useEffect } from 'react'
import { server } from '../../lib/config/server'
import FormBuilder from '../../components/form/form-builder'
import { useRouter } from 'next/router'
import { hasError, getErrorMessage } from '../../lib/validations/validations'
import { validateProductForm } from '../../lib/validations/product-validations'
import { getProductByRef, processUserForm } from '../../lib/handlers/handlers'
import Notification from '../../components/shared/notification'
import Product from '../../lib/models/product'
import Meta from '../meta'
import moment from 'moment'

function ProductFormBuilder(props) {
  let product = new Product({})
  const isEdit = props.edit ? true : false
  const isCopy = props.copy ? true : false
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [modalState, setModalState] = useState(product.getValues())
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMsg, setNotificationMsg] = useState({
    variant: '',
    msg: '',
  })
  const [schema, setSchema] = useState([])

  const router = useRouter()
  const fieldValues = {}

  useEffect(() => {
    Product.getSchema(isEdit, isCopy).then((result) => {
      setSchema(result)
    })
  }, [])

  let url = `${server}/api/products/create`
  if (isEdit) {
    const query = router.query
    const refNumber = query.id
    url = `${server}/api/products/${refNumber}/edit`

    if (isCopy) {
      url = `${server}/api/products/create`
    }
  }

  //Product Edit
  if (isEdit) {
    useEffect(async () => {
      setIsLoading(true)
      const query = router.query

      if (query) {
        const refNumber = query.id
        await getProductByRef(refNumber)
          .then((value) => {
            product = new Product(value)

            if (isCopy) {
              product.type = 'on-demand'
              product.name = product.name + ' - On Demand'
              product.slug =
                product.slug +
                '-on-demand-' +
                moment(new Date()).format('YYYYMMDD-HHmmss')
              product.originalCapacity = 0
              product.capacity = 0
              product.registrationEndDt = moment(
                new Date(product.registrationEndDt).toUTCString()
              )
                .set('year', 2050)
                .format('yyyy-MM-DD HH:mm:ss')
            }

            setModalState(product)
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
    let subTagString = ''
    if (enteredData.subtagMeta.length > 0) {
      enteredData.subtagMeta.map((tag, index) => {
        subTagString += tag.label + ', '
      })
    }
    enteredData['id'] = router.query.id || ''
    enteredData['subtagMetaString'] = subTagString.slice(0, -1)
    if (
      moment(new Date(enteredData['registrationEndDt'])).format('yyyy-MM-DD') ==
      moment(new Date()).format('yyyy-MM-DD')
    ) {
      enteredData['registrationEndDt'] = new Date('2050-12-01')
      enteredData['millisecondRegistrationEndDt'] = new Date('2050-12-01')
    }

    await validateProductForm(enteredData)
      .then(async (value) => {
        await processUserForm(url, enteredData)
          .then((response) => {
            // Add success message
            if (isEdit) {
              if (isCopy) {
                router.replace({
                  pathname: `${server}/products`,
                  query: { status: 'created' },
                })
              } else {
                setShowNotification(true)
                setNotificationMsg({
                  variant: 'success',
                  msg: 'Updated successfully',
                })
              }
            } else {
              router.replace({
                pathname: `${server}/products`,
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
        console.log(err)
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
        title={`${
          props.edit ? (props.copy ? 'Copy to On Demand' : 'Edit') : 'Add'
        } Program | Maven Admin`}
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
          isEdit={isEdit}
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

export default ProductFormBuilder
