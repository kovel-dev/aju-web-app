import * as Cx from '@coreui/react'
import Select from 'react-select'
import Link from 'next/link'
import PromoCode from '../../lib/models/promo-code'
import Product from '../../lib/models/product'
import { useEffect, useState } from 'react'
import { getErrorMessage, hasError } from '../../lib/validations/validations'
import { useRouter } from 'next/router'
import { server } from '../../lib/config/server'

function PromoCodeForm(props) {
  const isEdit = props.edit ? true : false
  const router = useRouter()
  let promoCode = new PromoCode({})
  let product = new Product({})

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [promoCodeState, setPromoCodeState] = useState(promoCode.getValues())
  const [productList, setProductList] = useState({})

  useEffect(async () => {
    setIsLoading(true)
    if (isEdit) {
      const query = router.query

      if (query) {
        const refNumber = query.id
        await promoCode
          .getPromoCodeByRef(refNumber)
          .then((promoCodeInfo) => {
            promoCode = new PromoCode(promoCodeInfo)
            setPromoCodeState(promoCode)
            setIsLoading(false)
          })
          .catch(function (err) {
            setErrors(err.response.data)
            setIsLoading(false)
            return
          })
      }
    }

    try {
      await product.getProductsForSelect().then((result) => {
        setProductList(result.data)
        setIsLoading(false)
      })
    } catch (error) {
      setErrors(error.response.data)
      setIsLoading(false)
      return
    }
  }, [])

  const handleSelectChange = (selectedOption) => {
    const newPromoCodeState = { ...promoCodeState }
    newPromoCodeState.products_meta = selectedOption
    setPromoCodeState(newPromoCodeState)
  }

  const submitHandler = async () => {
    setIsLoading(true)
    setErrors({})

    promoCode = new PromoCode(promoCodeState)
    try {
      if (isEdit) {
        const query = router.query

        if (query) {
          const refNumber = query.id
          await promoCode.update(refNumber).then((response) => {
            router.replace(`${server}/promo-codes`)
          })
        }
      } else {
        await promoCode.save().then((response) => {
          router.replace(`${server}/promo-codes`)
        })
      }
    } catch (error) {
      setErrors(error)
      setIsLoading(false)
    }
  }

  return (
    <div className="mt-5 container-fluid">
      <Link href={`${server}/promo-codes`}>
        <a className="btn btn-link">Go Back to List</a>
      </Link>
      {hasError(errors, 'general') && (
        <Cx.CCallout color="danger">
          {getErrorMessage(errors, 'general')}
        </Cx.CCallout>
      )}
      <Cx.CCard>
        <Cx.CCardHeader>
          {isEdit ? 'Edit Promo Code' : 'Create Promo Code'}
        </Cx.CCardHeader>
        <Cx.CCardBody>
          <Cx.CForm
            className="row g-3"
            onSubmit={() => {
              return false
            }}
          >
            <Cx.CCol md="12">
              <Cx.CFormLabel htmlFor="name">Promo Code Name</Cx.CFormLabel>
              <Cx.CFormControl
                id="name"
                name="name"
                type="text"
                invalid={hasError(errors, 'name') ? true : false}
                value={promoCodeState.name}
                disabled={isLoading}
                onChange={(e) => {
                  const newPromoCodeState = { ...promoCodeState }
                  newPromoCodeState.name = e.target.value
                  setPromoCodeState(newPromoCodeState)
                }}
              />
              {hasError(errors, 'name') && (
                <Cx.CFormFeedback invalid>
                  {getErrorMessage(errors, 'name')}
                </Cx.CFormFeedback>
              )}
            </Cx.CCol>
            <Cx.CCol md="12">
              <Cx.CFormLabel htmlFor="description">Description</Cx.CFormLabel>
              <Cx.CFormControl
                id="description"
                name="description"
                component="textarea"
                rows="3"
                invalid={hasError(errors, 'description') ? true : false}
                value={promoCodeState.description}
                disabled={isLoading}
                onChange={(e) => {
                  const newPromoCodeState = { ...promoCodeState }
                  newPromoCodeState.description = e.target.value
                  setPromoCodeState(newPromoCodeState)
                }}
              />
              {hasError(errors, 'description') && (
                <Cx.CFormFeedback invalid>
                  {getErrorMessage(errors, 'description')}
                </Cx.CFormFeedback>
              )}
            </Cx.CCol>
            {!isEdit && (
              <Cx.CCol md="6">
                <Cx.CFormLabel htmlFor="name">
                  Promo Code (Once created, it will be permanent)
                </Cx.CFormLabel>
                <Cx.CFormControl
                  id="code"
                  name="code"
                  type="text"
                  invalid={hasError(errors, 'code') ? true : false}
                  value={promoCodeState.code}
                  disabled={isLoading}
                  onChange={(e) => {
                    const newPromoCodeState = { ...promoCodeState }
                    newPromoCodeState.code = e.target.value
                    setPromoCodeState(newPromoCodeState)
                  }}
                />
                {hasError(errors, 'code') && (
                  <Cx.CFormFeedback invalid>
                    {getErrorMessage(errors, 'code')}
                  </Cx.CFormFeedback>
                )}
              </Cx.CCol>
            )}
            {isEdit && (
              <Cx.CCol md="6">
                <Cx.CFormLabel htmlFor="type">Promo Code</Cx.CFormLabel>
                <Cx.CFormControl
                  id="code"
                  name="code"
                  type="text"
                  disabled={true}
                  value={promoCodeState.code}
                />
              </Cx.CCol>
            )}

            <Cx.CCol md="6">
              <Cx.CFormLabel htmlFor="type">Status</Cx.CFormLabel>
              <Cx.CFormControl
                id="status"
                name="status"
                type="text"
                disabled={true}
                value={promoCodeState.status.toUpperCase()}
              />
            </Cx.CCol>
            <Cx.CCol md="6">
              <Cx.CFormLabel htmlFor="name">Percentage (%)</Cx.CFormLabel>
              <Cx.CFormControl
                id="percentage"
                name="percentage"
                type="text"
                invalid={hasError(errors, 'percentage') ? true : false}
                value={promoCodeState.percentage}
                disabled={isLoading}
                onChange={(e) => {
                  const newPromoCodeState = { ...promoCodeState }
                  newPromoCodeState.percentage = e.target.value
                  setPromoCodeState(newPromoCodeState)
                }}
              />
              {hasError(errors, 'percentage') && (
                <Cx.CFormFeedback invalid>
                  {getErrorMessage(errors, 'percentage')}
                </Cx.CFormFeedback>
              )}
            </Cx.CCol>
            <Cx.CCol md="6">
              <Cx.CFormLabel htmlFor="name">Number of Use Limit</Cx.CFormLabel>
              <Cx.CFormControl
                id="use_limit"
                name="use_limit"
                type="text"
                invalid={hasError(errors, 'use_limit') ? true : false}
                value={promoCodeState.use_limit}
                disabled={isLoading}
                onChange={(e) => {
                  const newPromoCodeState = { ...promoCodeState }
                  newPromoCodeState.use_limit = e.target.value
                  setPromoCodeState(newPromoCodeState)
                }}
              />
              {hasError(errors, 'use_limit') && (
                <Cx.CFormFeedback invalid>
                  {getErrorMessage(errors, 'use_limit')}
                </Cx.CFormFeedback>
              )}
            </Cx.CCol>
            <Cx.CCol md="12">
              <Cx.CFormLabel htmlFor="products">
                Applies to the following Product(s)
              </Cx.CFormLabel>
              <Select
                instanceId="products"
                name="products"
                isDisabled={isLoading}
                isMulti={true}
                placeholder={'Select Product(s)'}
                options={productList}
                value={promoCodeState.products_meta}
                onChange={handleSelectChange}
              />
            </Cx.CCol>

            <Cx.CCol md="12">
              <Cx.CButton
                type="button"
                color="primary"
                disabled={isLoading}
                onClick={() => submitHandler()}
              >
                {isLoading && <Cx.CSpinner component="span" size="sm" />}
                {isLoading ? '' : isEdit ? 'Update' : 'Create'}
              </Cx.CButton>
            </Cx.CCol>
          </Cx.CForm>
        </Cx.CCardBody>
      </Cx.CCard>
    </div>
  )
}

export default PromoCodeForm
