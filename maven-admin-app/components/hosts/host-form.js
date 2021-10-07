import * as Cx from '@coreui/react'
import Link from 'next/link'
import Host from '../../lib/models/host'
import AssetManager from '../assets/manager'
import Modal from '../shared/modal'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { server } from '../../lib/config/server'
import { getErrorMessage, hasError } from '../../lib/validations/validations'

function HostForm(props) {
  const isEdit = props.edit ? true : false
  const router = useRouter()
  let host = new Host({})

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [hostState, setHostState] = useState(host.getValues())

  // asset manager
  const [showAssetManagerModal, setShowAssetManagerModal] = useState(false)
  const [selectedAssetField, setSelectedAssetField] = useState(null)

  useEffect(async () => {
    if (isEdit) {
      setIsLoading(true)
      const query = router.query

      if (query) {
        const refNumber = query.id
        await host
          .getHostByRef(refNumber)
          .then((hostInfo) => {
            host = new Host(hostInfo)
            setHostState(host)
            setIsLoading(false)
          })
          .catch(function (err) {
            setErrors(err.response.data)
            setIsLoading(false)
            return
          })
      }
    }
  }, [])

  const processAssetManagerHandler = (fieldName) => {
    setSelectedAssetField(fieldName)
    setShowAssetManagerModal(true)
  }

  const selectAssetHandler = (ref, url) => {
    const newHostState = { ...hostState }
    newHostState[selectedAssetField] = ref
    newHostState[selectedAssetField + '_url'] = url
    setHostState(newHostState)
    setShowAssetManagerModal(false)
    setSelectedAssetField(null)
  }

  const submitHandler = async () => {
    setIsLoading(true)
    setErrors({})

    host = new Host(hostState)
    try {
      if (isEdit) {
        const query = router.query

        if (query) {
          const refNumber = query.id
          await host.update(refNumber).then((response) => {
            router.replace(`${server}/hosts`)
          })
        }
      } else {
        await host.save().then((response) => {
          router.replace(`${server}/hosts`)
        })
      }
    } catch (error) {
      setErrors(error)
      setIsLoading(false)
    }
  }

  return (
    <div className="mt-5 container-fluid">
      <Link href={`${server}/hosts`}>
        <a className="btn btn-link">Go Back to List</a>
      </Link>
      {hasError(errors, 'general') && (
        <Cx.CCallout color="danger">
          {getErrorMessage(errors, 'general')}
        </Cx.CCallout>
      )}
      <Cx.CCard>
        <Cx.CCardHeader>{isEdit ? 'Edit Host' : 'Create Host'}</Cx.CCardHeader>
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
                value={hostState.name}
                disabled={isLoading}
                onChange={(e) => {
                  const newHostState = { ...hostState }
                  newHostState.name = e.target.value
                  setHostState(newHostState)
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
                value={hostState.description}
                disabled={isLoading}
                onChange={(e) => {
                  const newHostState = { ...hostState }
                  newHostState.description = e.target.value
                  setHostState(newHostState)
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
                value={hostState.desktop_image_url}
                disabled={true}
                onChange={(e) => {
                  const newHostState = { ...hostState }
                  newHostState.desktop_image_url = e.target.value
                  setHostState(newHostState)
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
                value={hostState.mobile_image_url}
                disabled={true}
                onChange={(e) => {
                  const newHostState = { ...hostState }
                  newHostState.mobile_image_url = e.target.value
                  setHostState(newHostState)
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

export default HostForm
