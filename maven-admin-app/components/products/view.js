import * as Cx from '@coreui/react'
import Link from 'next/link'
import Product from '../../lib/models/product'
import { useEffect, useState } from 'react'
import { server } from '../../lib/config/server'
import { getErrorMessage, hasError } from '../../lib/validations/validations'
import { useRouter } from 'next/router'

function ViewProduct() {
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  let product = new Product({})
  const [productState, setProductState] = useState(product.getValues())
  const router = useRouter()

  useEffect(async () => {
    setIsLoading(true)
    const query = router.query

    if (query) {
      const refNumber = query.id
      await product
        .getProductByRef(refNumber)
        .then((productInfo) => {
          setProductState(productInfo)
          setIsLoading(false)
        })
        .catch(function (err) {
          setErrors(err.response.data)
          setIsLoading(false)
          return
        })
    }
  }, [])

  const buttonHandler = (ref, type) => {
    if (type == 'edit') {
      setIsLoading(true)
      router.push(`${server}/products/${ref}/edit`)
    }
  }

  return (
    <div className="container-fluid mt-5">
      <Link href={`${server}/products`}>
        <a className="btn btn-link">Go Back to List</a>
      </Link>
      {isLoading && (
        <div className="text-center mt-5">
          <Cx.CSpinner component="span" size="sm" /> Loading...
        </div>
      )}
      {hasError(errors, 'general') && (
        <Cx.CCallout color="danger">
          {getErrorMessage(errors, 'general')}
        </Cx.CCallout>
      )}
      <div className="d-grid gap-2 d-md-flex justify-content-md-end my-2">
        <Cx.CButton href={`${server}/products/${router.query.id}/edit`}>
          Edit
        </Cx.CButton>
      </div>
      <Cx.CCard>
        <Cx.CCardHeader>View Product</Cx.CCardHeader>
        <Cx.CCardBody>
          <Cx.CFormLabel htmlFor="name">Product Name</Cx.CFormLabel>
          <Cx.CCardText id="name" className="ml-3">
            <strong>{productState.name ? productState.name : '-'}</strong>
          </Cx.CCardText>

          <Cx.CFormLabel htmlFor="description">Description</Cx.CFormLabel>
          <Cx.CCardText id="description" className="ml-3">
            <strong>
              {productState.description ? productState.description : '-'}
            </strong>
          </Cx.CCardText>

          <Cx.CFormLabel htmlFor="short_description">
            Short Description
          </Cx.CFormLabel>
          <Cx.CCardText id="short_description" className="ml-3">
            <strong>
              {productState.short_description
                ? productState.short_description
                : '-'}
            </strong>
          </Cx.CCardText>

          <Cx.CFormLabel htmlFor="type">Type</Cx.CFormLabel>
          <Cx.CCardText id="type" className="ml-3">
            <strong>
              {productState.type ? productState.type.toUpperCase() : '-'}
            </strong>
          </Cx.CCardText>

          <Cx.CFormLabel htmlFor="delivery_type">Delivery Type</Cx.CFormLabel>
          <Cx.CCardText id="delivery_type" className="ml-3">
            <strong>
              {productState.delivery_type
                ? productState.delivery_type.toUpperCase()
                : '-'}
            </strong>
          </Cx.CCardText>

          <Cx.CFormLabel htmlFor="start_dt">Published Start Date</Cx.CFormLabel>
          <Cx.CCardText id="start_dt" className="ml-3">
            <strong>
              {productState.start_dt ? productState.start_dt.toString() : '-'}
            </strong>
          </Cx.CCardText>

          <Cx.CFormLabel htmlFor="end_dt">Published End Date</Cx.CFormLabel>
          <Cx.CCardText id="end_dt" className="ml-3">
            <strong>
              {productState.end_dt ? productState.end_dt.toString() : '-'}
            </strong>
          </Cx.CCardText>

          <Cx.CFormLabel htmlFor="registration_start_dt">
            Registration Start Date
          </Cx.CFormLabel>
          <Cx.CCardText id="registration_start_dt" className="ml-3">
            <strong>
              {productState.registration_start_dt
                ? productState.registration_start_dt.toString()
                : '-'}
            </strong>
          </Cx.CCardText>

          <Cx.CFormLabel htmlFor="registration_end_dt">
            Registration End Date
          </Cx.CFormLabel>
          <Cx.CCardText id="registration_end_dt" className="ml-3">
            <strong>
              {productState.registration_end_dt
                ? productState.registration_end_dt.toString()
                : '-'}
            </strong>
          </Cx.CCardText>

          <Cx.CFormLabel htmlFor="status">Status</Cx.CFormLabel>
          <Cx.CCardText id="status" className="ml-3">
            <strong>
              {productState.status ? productState.status.toUpperCase() : '-'}
            </strong>
          </Cx.CCardText>

          <Cx.CFormLabel htmlFor="price">Price</Cx.CFormLabel>
          <Cx.CCardText id="price" className="ml-3">
            <strong>{productState.price ? productState.price : '-'}</strong>
          </Cx.CCardText>

          <Cx.CFormLabel htmlFor="capacity">Capacity</Cx.CFormLabel>
          <Cx.CCardText id="capacity" className="ml-3">
            <strong>
              {productState.capacity ? productState.capacity : '-'}
            </strong>
          </Cx.CCardText>

          <Cx.CFormLabel htmlFor="language">Language</Cx.CFormLabel>
          <Cx.CCardText id="language" className="ml-3">
            <strong>
              {productState.language ? productState.language : '-'}
            </strong>
          </Cx.CCardText>

          <Cx.CFormLabel htmlFor="address">Address</Cx.CFormLabel>
          <Cx.CCardText id="address" className="ml-3">
            <strong>{productState.address ? productState.address : '-'}</strong>
          </Cx.CCardText>

          <Cx.CFormLabel htmlFor="duration">Duration</Cx.CFormLabel>
          <Cx.CCardText id="duration" className="ml-3">
            <strong>
              {productState.duration ? productState.duration : '-'}
            </strong>
          </Cx.CCardText>

          <Cx.CFormLabel htmlFor="level">Level</Cx.CFormLabel>
          <Cx.CCardText id="level" className="ml-3">
            <strong>
              {productState.level ? productState.level.toUpperCase() : '-'}
            </strong>
          </Cx.CCardText>

          <Cx.CFormLabel htmlFor="desktop_image">Desktop Image</Cx.CFormLabel>
          <Cx.CCardText id="desktop_image" className="ml-3">
            <strong>
              {productState.desktop_image ? productState.desktop_image : '-'}
            </strong>
          </Cx.CCardText>

          <Cx.CFormLabel htmlFor="mobile_image">Mobile Image</Cx.CFormLabel>
          <Cx.CCardText id="mobile_image" className="ml-3">
            <strong>
              {productState.mobile_image ? productState.mobile_image : '-'}
            </strong>
          </Cx.CCardText>

          <Cx.CFormLabel htmlFor="created_by">Created By</Cx.CFormLabel>
          <Cx.CCardText id="created_by" className="ml-3">
            <strong>
              {productState.created_by ? productState.created_by : '-'}
            </strong>
          </Cx.CCardText>

          <Cx.CFormLabel htmlFor="created_at">Created At</Cx.CFormLabel>
          <Cx.CCardText id="created_at" className="ml-3">
            <strong>
              {productState.created_at ? productState.created_at : '-'}
            </strong>
          </Cx.CCardText>

          <Cx.CFormLabel htmlFor="updated_by">Updated By</Cx.CFormLabel>
          <Cx.CCardText id="updated_by" className="ml-3">
            <strong>
              {productState.updated_by ? productState.updated_by : '-'}
            </strong>
          </Cx.CCardText>

          <Cx.CFormLabel htmlFor="updated_at">Updated At</Cx.CFormLabel>
          <Cx.CCardText id="updated_at" className="ml-3">
            <strong>
              {productState.updated_at ? productState.updated_at : '-'}
            </strong>
          </Cx.CCardText>

          <Cx.CFormLabel htmlFor="deleted_at">Deleted At</Cx.CFormLabel>
          <Cx.CCardText id="deleted_at" className="ml-3">
            <strong>
              {productState.deleted_at ? productState.deleted_at : '-'}
            </strong>
          </Cx.CCardText>
        </Cx.CCardBody>
      </Cx.CCard>
    </div>
  )
}

export default ViewProduct
