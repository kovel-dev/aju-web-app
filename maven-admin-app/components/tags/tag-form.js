import * as Cx from '@coreui/react'
import Link from 'next/link'
import Select from 'react-select'
import Tag from '../../lib/models/tag'
import AssetManager from '../assets/manager'
import Modal from '../shared/modal'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { server } from '../../lib/config/server'
import { getErrorMessage, hasError } from '../../lib/validations/validations'

function TagForm(props) {
  const isEdit = props.edit ? true : false
  const router = useRouter()
  let tag = new Tag({})

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [tagState, setTagState] = useState(tag.getValues())
  const [tagList, setTagList] = useState({})

  // asset manager
  const [showAssetManagerModal, setShowAssetManagerModal] = useState(false)
  const [selectedAssetField, setSelectedAssetField] = useState(null)

  useEffect(async () => {
    setIsLoading(true)
    if (isEdit) {
      const query = router.query

      if (query) {
        const refNumber = query.id
        await tag
          .getTagByRef(refNumber)
          .then((tagInfo) => {
            tag = new Tag(tagInfo)
            setTagState(tag)
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
      const query = router.query
      let refNumber = null

      if (query) {
        refNumber = query.id
      }
      await tag.getTagsForSelect(refNumber).then((result) => {
        setTagList(result.data)
        setIsLoading(false)
      })
    } catch (error) {
      setErrors(error)
      setIsLoading(false)
    }
  }, [])

  const selectIsFeaturedHandler = (selectedOption) => {
    const newTagState = { ...tagState }
    newTagState.is_featured = selectedOption
    setTagState(newTagState)
  }

  const selectSimilarTagsHandler = (selectedOption) => {
    const newTagState = { ...tagState }
    newTagState.similar_tags = selectedOption
    setTagState(newTagState)
  }

  const processAssetManagerHandler = (fieldName) => {
    setSelectedAssetField(fieldName)
    setShowAssetManagerModal(true)
  }

  const selectAssetHandler = (ref, url) => {
    const newTagState = { ...tagState }
    newTagState[selectedAssetField] = ref
    newTagState[selectedAssetField + '_url'] = url
    setTagState(newTagState)
    setShowAssetManagerModal(false)
    setSelectedAssetField(null)
  }

  const submitHandler = async () => {
    setIsLoading(true)
    setErrors({})

    tag = new Tag(tagState)
    try {
      if (isEdit) {
        const query = router.query

        if (query) {
          const refNumber = query.id
          await tag.update(refNumber).then((response) => {
            router.replace(`${server}/tags`)
          })
        }
      } else {
        await tag.save().then((response) => {
          router.replace(`${server}/tags`)
        })
      }
    } catch (error) {
      setErrors(error)
      setIsLoading(false)
    }
  }

  return (
    <div className="mt-5 container-fluid">
      <Link href={`${server}/tags`}>
        <a className="btn btn-link">Go Back to List</a>
      </Link>
      {hasError(errors, 'general') && (
        <Cx.CCallout color="danger">
          {getErrorMessage(errors, 'general')}
        </Cx.CCallout>
      )}
      <Cx.CCard>
        <Cx.CCardHeader>{isEdit ? 'Edit Tag' : 'Create Tag'}</Cx.CCardHeader>
        <Cx.CCardBody>
          <Cx.CForm
            className="row g-3"
            onSubmit={() => {
              return false
            }}
          >
            <Cx.CCol md="12">
              <Cx.CFormLabel htmlFor="name">Name</Cx.CFormLabel>
              <Cx.CFormControl
                id="name"
                name="name"
                type="text"
                invalid={hasError(errors, 'name') ? true : false}
                value={tagState.name}
                disabled={isLoading}
                onChange={(e) => {
                  const newTagState = { ...tagState }
                  newTagState.name = e.target.value
                  setTagState(newTagState)
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
                value={tagState.description}
                disabled={isLoading}
                onChange={(e) => {
                  const newTagState = { ...tagState }
                  newTagState.description = e.target.value
                  setTagState(newTagState)
                }}
              />
              {hasError(errors, 'description') && (
                <Cx.CFormFeedback invalid>
                  {getErrorMessage(errors, 'description')}
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
                value={tagState.desktop_image_url}
                disabled={true}
                onChange={(e) => {
                  const newTagState = { ...tagState }
                  newTagState.desktop_image_url = e.target.value
                  setTagState(newTagState)
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
                value={tagState.mobile_image_url}
                disabled={true}
                onChange={(e) => {
                  const newTagState = { ...tagState }
                  newTagState.mobile_image_url = e.target.value
                  setTagState(newTagState)
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
            <Cx.CCol md="6">
              <Cx.CFormLabel htmlFor="is_featured">Is Featured?</Cx.CFormLabel>
              <Select
                instanceId="is_featured"
                name="is_featured"
                isDisabled={isLoading}
                options={tag.getIsFeaturedStatus()}
                value={tagState.is_featured}
                onChange={selectIsFeaturedHandler}
              />
            </Cx.CCol>
            <Cx.CCol md="6">
              <Cx.CFormLabel htmlFor="similar_tags">Similar Tags</Cx.CFormLabel>
              <Select
                instanceId="similar_tags"
                name="similar_tags"
                isDisabled={isLoading}
                isMulti={true}
                placeholder={'Select Tag(s)'}
                options={tagList}
                value={tagState.similar_tags}
                onChange={selectSimilarTagsHandler}
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

export default TagForm
