import 'react-datepicker/dist/react-datepicker.css'
import * as Cx from '@coreui/react'
import moment from 'moment'
import Link from 'next/link'
import Select from 'react-select'
import Product from '../../lib/models/product'
import Question from '../../lib/models/question'
import Tag from '../../lib/models/tag'
import Host from '../../lib/models/host'
import DateTimePicker from 'react-datepicker'
import AssetManager from '../assets/manager'
import Modal from '../shared/modal'
import { useEffect, useState } from 'react'
import { getErrorMessage, hasError } from '../../lib/validations/validations'
import { useRouter } from 'next/router'
import { server } from '../../lib/config/server'

function ProductForm(props) {
  const isEdit = props.edit ? true : false
  let product = new Product({})
  let question = new Question({})
  let tag = new Tag({})
  let host = new Host({})
  const router = useRouter()

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [productState, setProductState] = useState(product.getValues())
  const [questionList, setQuestionList] = useState({})
  const [tagList, setTagList] = useState({})
  const [hostList, setHostList] = useState({})

  // asset manager
  const [showAssetManagerModal, setShowAssetManagerModal] = useState(false)
  const [selectedAssetField, setSelectedAssetField] = useState(null)

  useEffect(async () => {
    if (isEdit) {
      setIsLoading(true)
      const query = router.query

      if (query) {
        const refNumber = query.id
        await product
          .getProductByRef(refNumber)
          .then((productInfo) => {
            product = new Product(productInfo)
            setProductState(product)
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
      setIsLoading(true)
      await question.getQuestionsForSelect().then((result) => {
        setQuestionList(result.data)
        setIsLoading(false)
      })
    } catch (error) {
      setErrors(error)
      setIsLoading(false)
    }

    try {
      setIsLoading(true)
      await tag.getTagsForSelect().then((result) => {
        setTagList(result.data)
        setIsLoading(false)
      })
    } catch (error) {
      setErrors(error)
      setIsLoading(false)
    }

    try {
      setIsLoading(true)
      await host.getHostsForSelect().then((result) => {
        setHostList(result.data)
        setIsLoading(false)
      })
    } catch (error) {
      setErrors(error)
      setIsLoading(false)
    }
  }, [])

  const selectHostHandler = (selectedOption) => {
    const newProductState = { ...productState }
    newProductState.host_meta = selectedOption
    setProductState(newProductState)
  }

  const selectTagHandler = (selectedOption) => {
    const newProductState = { ...productState }
    newProductState.tag_meta = selectedOption
    setProductState(newProductState)
  }

  const selectQuestionHandler = (selectedOption) => {
    const newProductState = { ...productState }
    newProductState.question_meta = selectedOption
    setProductState(newProductState)
  }

  const processAssetManagerHandler = (fieldName) => {
    setSelectedAssetField(fieldName)
    setShowAssetManagerModal(true)
  }

  const selectAssetHandler = (ref, url) => {
    const newProductState = { ...productState }
    newProductState[selectedAssetField] = ref
    newProductState[selectedAssetField + '_url'] = url
    setProductState(newProductState)
    setShowAssetManagerModal(false)
    setSelectedAssetField(null)
  }

  const processFormHandler = async (status) => {
    productState.status = status
    await submitHandler(productState)
  }

  const submitHandler = async (newProductState) => {
    setIsLoading(true)
    setErrors({})

    product = new Product(newProductState)
    try {
      if (isEdit) {
        const query = router.query

        if (query) {
          const refNumber = query.id
          await product.update(refNumber).then((response) => {
            router.replace(`${server}/products`)
          })
        }
      } else {
        await product.save().then((response) => {
          router.replace(`${server}/products`)
        })
      }
    } catch (error) {
      setErrors(error)
      setIsLoading(false)
    }
  }

  return (
    <div className="mt-5 container-fluid">
      <Link href={`${server}/products`}>
        <a className="btn btn-link">Go Back to List</a>
      </Link>
      {hasError(errors, 'general') && (
        <Cx.CCallout color="danger">
          {getErrorMessage(errors, 'general')}
        </Cx.CCallout>
      )}
      <Cx.CCard>
        <Cx.CCardHeader>
          {isEdit ? 'Edit Product' : 'Create Product'}
        </Cx.CCardHeader>
        <Cx.CCardBody>
          <Cx.CForm
            className="row g-3"
            onSubmit={() => {
              return false
            }}
          >
            <Cx.CCol md="12">
              <Cx.CFormLabel htmlFor="name">Product Name</Cx.CFormLabel>
              <Cx.CFormControl
                id="name"
                name="name"
                type="text"
                invalid={hasError(errors, 'name') ? true : false}
                value={productState.name}
                disabled={isLoading}
                onChange={(e) => {
                  const newProductState = { ...productState }
                  newProductState.name = e.target.value
                  setProductState(newProductState)
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
                value={productState.description}
                disabled={isLoading}
                onChange={(e) => {
                  const newProductState = { ...productState }
                  newProductState.description = e.target.value
                  setProductState(newProductState)
                }}
              />
              {hasError(errors, 'description') && (
                <Cx.CFormFeedback invalid>
                  {getErrorMessage(errors, 'description')}
                </Cx.CFormFeedback>
              )}
            </Cx.CCol>
            <Cx.CCol md="12">
              <Cx.CFormLabel htmlFor="short_description">
                Short Description
              </Cx.CFormLabel>
              <Cx.CFormControl
                id="short_description"
                name="short_description"
                type="text"
                invalid={hasError(errors, 'short_description') ? true : false}
                value={productState.short_description}
                disabled={isLoading}
                onChange={(e) => {
                  const newProductState = { ...productState }
                  newProductState.short_description = e.target.value
                  setProductState(newProductState)
                }}
              />
              {hasError(errors, 'short_description') && (
                <Cx.CFormFeedback invalid>
                  {getErrorMessage(errors, 'short_description')}
                </Cx.CFormFeedback>
              )}
            </Cx.CCol>
            <Cx.CCol md="12">
              <Cx.CFormLabel htmlFor="address">Address</Cx.CFormLabel>
              <Cx.CFormControl
                id="address"
                name="address"
                type="text"
                invalid={hasError(errors, 'address') ? true : false}
                value={productState.address}
                disabled={isLoading}
                onChange={(e) => {
                  const newProductState = { ...productState }
                  newProductState.address = e.target.value
                  setProductState(newProductState)
                }}
              />
              {hasError(errors, 'address') && (
                <Cx.CFormFeedback invalid>
                  {getErrorMessage(errors, 'address')}
                </Cx.CFormFeedback>
              )}
            </Cx.CCol>
            {isEdit && (
              <Cx.CCol md="6">
                <Cx.CFormLabel htmlFor="status">Status</Cx.CFormLabel>
                <Cx.CFormControl
                  id="status"
                  name="status"
                  type="text"
                  disabled={true}
                  value={productState.status.toUpperCase()}
                />
              </Cx.CCol>
            )}
            <Cx.CCol md="6">
              <Cx.CFormLabel htmlFor="type">Type</Cx.CFormLabel>
              <Cx.CFormSelect
                id="type"
                name="type"
                disabled={isLoading}
                invalid={hasError(errors, 'type') ? true : false}
                value={productState.type}
                onChange={(e) => {
                  const newProductState = { ...productState }
                  newProductState.type = e.target.value
                  setProductState(newProductState)
                }}
              >
                <option value="">Select Type</option>
                {Object.keys(product.getTypes()).map(function (key, index) {
                  return (
                    <option value={key} key={index}>
                      {product.getTypes()[key]}
                    </option>
                  )
                })}
              </Cx.CFormSelect>
              {hasError(errors, 'type') && (
                <Cx.CFormFeedback invalid>
                  {getErrorMessage(errors, 'type')}
                </Cx.CFormFeedback>
              )}
            </Cx.CCol>
            <Cx.CCol md="6">
              <Cx.CFormLabel htmlFor="delivery_type">
                Delivery Type
              </Cx.CFormLabel>
              <Cx.CFormSelect
                id="delivery_type"
                name="delivery_type"
                disabled={isLoading}
                invalid={hasError(errors, 'type') ? true : false}
                value={productState.delivery_type}
                onChange={(e) => {
                  const newProductState = { ...productState }
                  newProductState.delivery_type = e.target.value
                  setProductState(newProductState)
                }}
              >
                <option value="">Select Delivery Type</option>
                {Object.keys(product.getDeliveryTypes()).map(function (
                  key,
                  index
                ) {
                  return (
                    <option value={key} key={index}>
                      {product.getDeliveryTypes()[key]}
                    </option>
                  )
                })}
              </Cx.CFormSelect>
              {hasError(errors, 'delivery_type') && (
                <Cx.CFormFeedback invalid>
                  {getErrorMessage(errors, 'delivery_type')}
                </Cx.CFormFeedback>
              )}
            </Cx.CCol>
            <Cx.CCol md="6">
              <Cx.CFormLabel htmlFor="start_dt">
                Publish Start Date
              </Cx.CFormLabel>
              <DateTimePicker
                id="start_dt"
                name="start_dt"
                className={
                  hasError(errors, 'start_dt')
                    ? 'form-control invalid red-border'
                    : 'form-control'
                }
                selected={
                  productState.start_dt ? new Date(productState.start_dt) : null
                }
                showTimeSelect
                timeIntervals={15}
                dateFormat="yyyy-MM-dd HH:mm:ss"
                disabled={isLoading}
                onChange={(value) => {
                  const newProductState = { ...productState }
                  newProductState.start_dt = new Date(
                    moment(value.toUTCString()).format('yyyy-MM-DD HH:mm:ss')
                  )
                  setProductState(newProductState)
                }}
              />
              <Cx.CFormControl
                type="hidden"
                invalid={hasError(errors, 'start_dt') ? true : false}
                value={productState.start_dt}
              />
              {hasError(errors, 'start_dt') && (
                <Cx.CFormFeedback invalid>
                  {getErrorMessage(errors, 'start_dt')}
                </Cx.CFormFeedback>
              )}
            </Cx.CCol>
            <Cx.CCol md="6">
              <Cx.CFormLabel htmlFor="end_dt">Publish End Date</Cx.CFormLabel>
              <DateTimePicker
                id="end_dt"
                name="end_dt"
                className={
                  hasError(errors, 'end_dt')
                    ? 'form-control invalid red-border'
                    : 'form-control'
                }
                disabled={isLoading}
                showTimeSelect
                timeIntervals={15}
                dateFormat="yyyy-MM-dd HH:mm:ss"
                selected={
                  productState.end_dt ? new Date(productState.end_dt) : null
                }
                onChange={(value) => {
                  const newProductState = { ...productState }
                  newProductState.end_dt = new Date(
                    moment(value.toUTCString()).format('yyyy-MM-DD HH:mm:ss')
                  )
                  setProductState(newProductState)
                }}
              />
              <Cx.CFormControl
                type="hidden"
                invalid={hasError(errors, 'end_dt') ? true : false}
                value={productState.end_dt}
              />
              {hasError(errors, 'end_dt') && (
                <Cx.CFormFeedback invalid>
                  {getErrorMessage(errors, 'end_dt')}
                </Cx.CFormFeedback>
              )}
            </Cx.CCol>
            <Cx.CCol md="6">
              <Cx.CFormLabel htmlFor="registration_start_dt">
                Registration Start Date
              </Cx.CFormLabel>
              <DateTimePicker
                id="registration_start_dt"
                name="registration_start_dt"
                className={
                  hasError(errors, 'registration_start_dt')
                    ? 'form-control invalid red-border'
                    : 'form-control'
                }
                selected={
                  productState.registration_start_dt
                    ? new Date(productState.registration_start_dt)
                    : null
                }
                dateFormat="yyyy-MM-dd HH:mm:ss"
                showTimeSelect
                timeIntervals={15}
                disabled={isLoading}
                strictParsing
                onChange={(value) => {
                  const newProductState = { ...productState }
                  newProductState.registration_start_dt = new Date(
                    moment(value.toUTCString()).format('yyyy-MM-DD HH:mm:ss')
                  )
                  setProductState(newProductState)
                }}
              />
              <Cx.CFormControl
                type="hidden"
                invalid={
                  hasError(errors, 'registration_start_dt') ? true : false
                }
                value={productState.registration_start_dt}
              />
              {hasError(errors, 'registration_start_dt') && (
                <Cx.CFormFeedback invalid>
                  {getErrorMessage(errors, 'registration_start_dt')}
                </Cx.CFormFeedback>
              )}
            </Cx.CCol>
            <Cx.CCol md="6">
              <Cx.CFormLabel htmlFor="registration_end_dt">
                Registration End Date
              </Cx.CFormLabel>
              <DateTimePicker
                id="registration_end_dt"
                name="registration_end_dt"
                className={
                  hasError(errors, 'registration_end_dt')
                    ? 'form-control invalid red-border'
                    : 'form-control'
                }
                selected={
                  productState.registration_end_dt
                    ? new Date(productState.registration_end_dt)
                    : null
                }
                dateFormat="yyyy-MM-dd HH:mm:ss"
                showTimeSelect
                timeIntervals={15}
                disabled={isLoading}
                onChange={(value) => {
                  const newProductState = { ...productState }
                  newProductState.registration_end_dt = new Date(
                    moment(value.toUTCString()).format('yyyy-MM-DD HH:mm:ss')
                  )
                  setProductState(newProductState)
                }}
              />
              <Cx.CFormControl
                type="hidden"
                invalid={hasError(errors, 'registration_end_dt') ? true : false}
                value={productState.registration_end_dt}
              />
              {hasError(errors, 'registration_end_dt') && (
                <Cx.CFormFeedback invalid>
                  {getErrorMessage(errors, 'registration_end_dt')}
                </Cx.CFormFeedback>
              )}
            </Cx.CCol>
            <Cx.CCol md="6">
              <Cx.CFormLabel htmlFor="price">Price</Cx.CFormLabel>
              <Cx.CFormControl
                id="price"
                name="price"
                type="number"
                invalid={hasError(errors, 'price') ? true : false}
                value={productState.price}
                disabled={isLoading}
                onChange={(e) => {
                  const newProductState = { ...productState }
                  newProductState.price = e.target.value
                  setProductState(newProductState)
                }}
              />
              {hasError(errors, 'price') && (
                <Cx.CFormFeedback invalid>
                  {getErrorMessage(errors, 'price')}
                </Cx.CFormFeedback>
              )}
            </Cx.CCol>
            <Cx.CCol md="6">
              <Cx.CFormLabel htmlFor="capacity">Capacity</Cx.CFormLabel>
              <Cx.CFormControl
                id="capacity"
                name="capacity"
                type="number"
                invalid={hasError(errors, 'capacity') ? true : false}
                value={productState.capacity}
                disabled={isLoading}
                onChange={(e) => {
                  const newProductState = { ...productState }
                  newProductState.capacity = e.target.value
                  setProductState(newProductState)
                }}
              />
              {hasError(errors, 'capacity') && (
                <Cx.CFormFeedback invalid>
                  {getErrorMessage(errors, 'capacity')}
                </Cx.CFormFeedback>
              )}
            </Cx.CCol>
            <Cx.CCol md="6">
              <Cx.CFormLabel htmlFor="language">Language</Cx.CFormLabel>
              <Cx.CFormControl
                id="language"
                name="language"
                type="text"
                invalid={hasError(errors, 'language') ? true : false}
                value={productState.language}
                disabled={isLoading}
                onChange={(e) => {
                  const newProductState = { ...productState }
                  newProductState.language = e.target.value
                  setProductState(newProductState)
                }}
              />
              {hasError(errors, 'language') && (
                <Cx.CFormFeedback invalid>
                  {getErrorMessage(errors, 'language')}
                </Cx.CFormFeedback>
              )}
            </Cx.CCol>
            <Cx.CCol md="6">
              <Cx.CFormLabel htmlFor="duration">Duration</Cx.CFormLabel>
              <Cx.CFormControl
                id="duration"
                name="duration"
                type="text"
                invalid={hasError(errors, 'duration') ? true : false}
                value={productState.duration}
                onChange={(e) => {
                  const newProductState = { ...productState }
                  newProductState.duration = e.target.value
                  setProductState(newProductState)
                }}
                disabled={isLoading}
              />
              {hasError(errors, 'duration') && (
                <Cx.CFormFeedback invalid>
                  {getErrorMessage(errors, 'duration')}
                </Cx.CFormFeedback>
              )}
            </Cx.CCol>

            <Cx.CCol md="6">
              <Cx.CFormLabel htmlFor="level">Level</Cx.CFormLabel>
              <Cx.CFormSelect
                id="level"
                name="level"
                disabled={isLoading}
                invalid={hasError(errors, 'type') ? true : false}
                value={productState.level}
                onChange={(e) => {
                  const newProductState = { ...productState }
                  newProductState.level = e.target.value
                  setProductState(newProductState)
                }}
              >
                <option value="">Select Level</option>
                {Object.keys(product.getLevels()).map(function (key, index) {
                  return (
                    <option value={key} key={index}>
                      {product.getLevels()[key]}
                    </option>
                  )
                })}
              </Cx.CFormSelect>
              {hasError(errors, 'level') && (
                <Cx.CFormFeedback invalid>
                  {getErrorMessage(errors, 'level')}
                </Cx.CFormFeedback>
              )}
            </Cx.CCol>
            <Cx.CCol md="6">
              <Cx.CFormLabel htmlFor="desktop_image_url">
                Desktop Image
              </Cx.CFormLabel>
              <Cx.CFormControl
                id="desktop_image_url"
                name="desktop_image_url"
                type="text"
                invalid={hasError(errors, 'desktop_image_url') ? true : false}
                value={productState.desktop_image_url}
                disabled={true}
                onChange={(e) => {
                  const newProductState = { ...productState }
                  newProductState.desktop_image_url = e.target.value
                  setProductState(newProductState)
                }}
              />
              <Cx.CButton
                type="button"
                color="primary"
                disabled={isLoading}
                onClick={() => processAssetManagerHandler('desktop_image')}
              >
                {isLoading && <Cx.CSpinner component="span" size="sm" />}
                {isLoading ? '' : 'Select'}
              </Cx.CButton>
              {hasError(errors, 'desktop_image_url') && (
                <Cx.CFormFeedback invalid>
                  {getErrorMessage(errors, 'desktop_image_url')}
                </Cx.CFormFeedback>
              )}
            </Cx.CCol>
            <Cx.CCol md="6">
              <Cx.CFormLabel htmlFor="mobile_image_url">
                Mobile Image
              </Cx.CFormLabel>
              <Cx.CFormControl
                id="mobile_image_url"
                name="mobile_image_url"
                type="text"
                invalid={hasError(errors, 'mobile_image_url') ? true : false}
                value={productState.mobile_image_url}
                disabled={true}
                onChange={(e) => {
                  const newProductState = { ...productState }
                  newProductState.mobile_image_url = e.target.value
                  setProductState(newProductState)
                }}
              />
              <Cx.CButton
                type="button"
                color="primary"
                disabled={isLoading}
                onClick={() => processAssetManagerHandler('mobile_image')}
              >
                {isLoading && <Cx.CSpinner component="span" size="sm" />}
                {isLoading ? '' : 'Select'}
              </Cx.CButton>
              {hasError(errors, 'mobile_image_url') && (
                <Cx.CFormFeedback invalid>
                  {getErrorMessage(errors, 'mobile_image_url')}
                </Cx.CFormFeedback>
              )}
            </Cx.CCol>
            <Cx.CCol md="12">
              <Cx.CFormLabel htmlFor="questions">Question(s)</Cx.CFormLabel>
              <Select
                instanceId="questions"
                name="questions"
                isDisabled={isLoading}
                isMulti={true}
                placeholder={'Select Question(s)'}
                options={questionList}
                value={productState.question_meta}
                onChange={selectQuestionHandler}
              />
            </Cx.CCol>
            <Cx.CCol md="12">
              <Cx.CFormLabel htmlFor="tags">Tag(s)</Cx.CFormLabel>
              <Select
                instanceId="tags"
                name="tags"
                isDisabled={isLoading}
                isMulti={true}
                placeholder={'Select Tag(s)'}
                options={tagList}
                value={productState.tag_meta}
                onChange={selectTagHandler}
              />
            </Cx.CCol>
            <Cx.CCol md="12">
              <Cx.CFormLabel htmlFor="hosts">Host(s)</Cx.CFormLabel>
              <Select
                instanceId="hosts"
                name="hosts"
                isDisabled={isLoading}
                isMulti={true}
                placeholder={'Select Host(s)'}
                options={hostList}
                value={productState.host_meta}
                onChange={selectHostHandler}
              />
            </Cx.CCol>
            <Cx.CCol md="12">
              {!isEdit && (
                <>
                  <Cx.CButton
                    type="button"
                    color="primary"
                    disabled={isLoading}
                    onClick={() => processFormHandler('draft')}
                  >
                    {isLoading && <Cx.CSpinner component="span" size="sm" />}
                    {isLoading ? '' : 'Draft'}
                  </Cx.CButton>
                  <Cx.CButton
                    type="button"
                    color="primary"
                    disabled={isLoading}
                    onClick={() => processFormHandler('published')}
                  >
                    {isLoading && <Cx.CSpinner component="span" size="sm" />}
                    {isLoading ? '' : 'Publish'}
                  </Cx.CButton>
                </>
              )}

              {isEdit && (
                <Cx.CButton
                  type="button"
                  color="primary"
                  disabled={isLoading}
                  onClick={() => processFormHandler(productState.status)}
                >
                  {isLoading && <Cx.CSpinner component="span" size="sm" />}
                  {isLoading ? '' : 'Update'}
                </Cx.CButton>
              )}

              {isEdit && productState.status == 'published' && (
                <Cx.CButton
                  type="button"
                  color="danger"
                  disabled={isLoading}
                  onClick={() => processFormHandler('unpublished')}
                >
                  {isLoading && <Cx.CSpinner component="span" size="sm" />}
                  {isLoading ? '' : 'Update & Unpublish'}
                </Cx.CButton>
              )}

              {isEdit &&
                (productState.status == 'unpublished' ||
                  productState.status == 'draft') && (
                  <Cx.CButton
                    type="button"
                    color="primary"
                    disabled={isLoading}
                    onClick={() => processFormHandler('published')}
                  >
                    {isLoading && <Cx.CSpinner component="span" size="sm" />}
                    {isLoading ? '' : 'Update & Publish'}
                  </Cx.CButton>
                )}
            </Cx.CCol>
          </Cx.CForm>
        </Cx.CCardBody>
      </Cx.CCard>
      <Modal
        title="Asset Manager"
        show={showAssetManagerModal}
        onShowModal={setShowAssetManagerModal}
        size="xl"
      >
        <Cx.CModalBody>
          <AssetManager onSelect={selectAssetHandler} />
        </Cx.CModalBody>
      </Modal>
    </div>
  )
}

export default ProductForm
