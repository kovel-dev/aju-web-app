import * as Cx from '@coreui/react'
import Asset from '../../lib/models/asset'
import Link from 'next/link'
import Pagination from '../shared/pagination'
import { useEffect, useRef, useState } from 'react'
import { hasError, getErrorMessage } from '../../lib/validations/validations'

function AssetManager(props) {
  const hasSelect = props.onSelect ? true : false

  let asset = new Asset({})
  const uploadFileInputRef = useRef()
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [uploadFile, setUploadFile] = useState(asset.getValues())
  const [assetList, setAssetList] = useState([])

  // for Pagination
  const [totalItems, setTotalItems] = useState(0)
  const [numOfItemsPerPage, setNumOfItemsPerPage] = useState(10)

  useEffect(async () => {
    setErrors({})
    setIsLoading(true)
    await updatePage(1, numOfItemsPerPage)
  }, [])

  const processFormHandler = async () => {
    try {
      setIsLoading(true)
      setErrors({})
      let asset = new Asset(uploadFile)

      await asset.save().then(async (response) => {
        await updatePage(1, numOfItemsPerPage)
        asset = new Asset({})
        uploadFileInputRef.current.value = ''
        setUploadFile(asset.getValues())
        setIsLoading(false)
      })
    } catch (error) {
      setErrors(error)
      setIsLoading(false)
    }
  }

  const deleteAssetHandler = async (refNumber) => {
    try {
      setIsLoading(true)
      setErrors({})
      let asset = new Asset(uploadFile)

      await asset.delete(refNumber).then(async (response) => {
        await updatePage(1, numOfItemsPerPage)
        asset = new Asset({})
        uploadFileInputRef.current.value = ''
        setUploadFile(asset.getValues())
        setIsLoading(false)
      })
    } catch (error) {
      setErrors(error)
      setIsLoading(false)
    }
  }

  const updatePage = async (newPage, limit) => {
    setErrors({})
    setIsLoading(true)
    await asset
      .getList(newPage, limit)
      .then((response) => {
        setIsLoading(false)
        setAssetList(response.data)
        setTotalItems(response.count)
      })
      .catch((error) => {
        setErrors(error.response.data)
        setIsLoading(false)
      })
  }

  return (
    <div className="container-fluid mt-5">
      {isLoading && (
        <div className="text-center mt-5">
          <Cx.CSpinner component="span" size="sm" /> Processing...
        </div>
      )}
      {hasError(errors, 'general') && (
        <Cx.CCallout color="danger">
          {getErrorMessage(errors, 'general')}
        </Cx.CCallout>
      )}
      <div className="container-fluid mt-5">
        <Cx.CCard>
          <Cx.CCardBody>
            <Cx.CCol md="12">
              <Cx.CFormLabel htmlFor="upload_file">Asset</Cx.CFormLabel>
              <Cx.CFormControl
                id="upload_file"
                name="upload_file"
                type="file"
                disabled={isLoading}
                ref={uploadFileInputRef}
                invalid={hasError(errors, 'upload_file') ? true : false}
                onChange={(event) => {
                  const newAssetState = { ...uploadFile }
                  newAssetState.upload_file = event.target.files[0]
                  setUploadFile(newAssetState)
                }}
              />
              {hasError(errors, 'upload_file') && (
                <Cx.CFormFeedback invalid>
                  {getErrorMessage(errors, 'upload_file')}
                </Cx.CFormFeedback>
              )}
            </Cx.CCol>

            <Cx.CCol md="12" className="mt-2">
              <Cx.CButton
                type="button"
                color="primary"
                disabled={isLoading}
                onClick={() => processFormHandler()}
              >
                {isLoading && <Cx.CSpinner component="span" size="sm" />}
                {isLoading ? '' : 'Upload'}
              </Cx.CButton>
            </Cx.CCol>
          </Cx.CCardBody>
        </Cx.CCard>
      </div>

      <div className="container-fluid mt-5">
        <Cx.CCard>
          <Cx.CCardHeader>Assets</Cx.CCardHeader>
          <Cx.CCardBody>
            <Cx.CTable>
              <Cx.CTableHead>
                <Cx.CTableRow>
                  <Cx.CTableHeaderCell scope="col">Name</Cx.CTableHeaderCell>
                  <Cx.CTableHeaderCell scope="col">Type</Cx.CTableHeaderCell>
                  <Cx.CTableHeaderCell scope="col">
                    Dimension (WxH)
                  </Cx.CTableHeaderCell>
                  <Cx.CTableHeaderCell scope="col">Link</Cx.CTableHeaderCell>
                  <Cx.CTableHeaderCell scope="col">Actions</Cx.CTableHeaderCell>
                </Cx.CTableRow>
              </Cx.CTableHead>
              <Cx.CTableBody>
                {assetList.map((asset, index) => {
                  return (
                    <Cx.CTableRow key={index}>
                      <Cx.CTableDataCell>{asset.name}</Cx.CTableDataCell>
                      <Cx.CTableDataCell>{asset.type}</Cx.CTableDataCell>
                      <Cx.CTableDataCell>
                        {asset.width + 'x' + asset.height}
                      </Cx.CTableDataCell>
                      <Cx.CTableDataCell>
                        {isLoading && asset.url}
                        {!isLoading && (
                          <Link href={asset.url}>
                            <a target="_blank" disabled={isLoading}>
                              {asset.url}
                            </a>
                          </Link>
                        )}
                      </Cx.CTableDataCell>
                      <Cx.CTableDataCell>
                        <Cx.CButton
                          color="danger"
                          onClick={() => deleteAssetHandler(asset.ref)}
                          disabled={isLoading}
                        >
                          Delete
                        </Cx.CButton>
                        {hasSelect && (
                          <Cx.CButton
                            onClick={() => props.onSelect(asset.ref, asset.url)}
                            disabled={isLoading}
                          >
                            Select
                          </Cx.CButton>
                        )}
                      </Cx.CTableDataCell>
                    </Cx.CTableRow>
                  )
                })}
              </Cx.CTableBody>
            </Cx.CTable>
            <Pagination
              numOfItemsPerPage={parseInt(numOfItemsPerPage)}
              onClickPage={updatePage}
              totalItems={totalItems}
            />
          </Cx.CCardBody>
        </Cx.CCard>
      </div>
    </div>
  )
}

export default AssetManager
