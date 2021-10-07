import * as Cx from '@coreui/react'
import Link from 'next/link'
import Select from 'react-select'
import Organization from '../../lib/models/organization'
import User from '../../lib/models/user'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { server } from '../../lib/config/server'
import { getErrorMessage, hasError } from '../../lib/validations/validations'

function OrganizationForm(props) {
  const isEdit = props.edit ? true : false
  const router = useRouter()
  let organization = new Organization({})
  let user = new User({})

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [organizationState, setOrganizationState] = useState(
    organization.getValues()
  )
  const [userList, setUserList] = useState({})

  useEffect(async () => {
    if (isEdit) {
      setIsLoading(true)
      const query = router.query

      if (query) {
        const refNumber = query.id
        await organization
          .getOrganizationByRef(refNumber)
          .then((organizationInfo) => {
            organization = new Organization(organizationInfo)
            setOrganizationState(organization)
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
      await user.getAdminUsers().then((result) => {
        setUserList(result.data)
        setIsLoading(false)
      })
    } catch (error) {
      setErrors(error)
      setIsLoading(false)
    }
  }, [])

  const selectOwnerIdHandler = (selectedOption) => {
    const newOrganizationState = { ...organizationState }
    newOrganizationState.owner_id = selectedOption
    setOrganizationState(newOrganizationState)
  }

  const selectIsFeaturedHandler = (selectedOption) => {
    const newOrganizationState = { ...organizationState }
    newOrganizationState.is_featured = selectedOption
    setOrganizationState(newOrganizationState)
  }

  const submitHandler = async () => {
    setIsLoading(true)
    setErrors({})

    organization = new Organization(organizationState)
    try {
      if (isEdit) {
        const query = router.query

        if (query) {
          const refNumber = query.id
          await organization.update(refNumber).then((response) => {
            router.replace(`${server}/organizations`)
          })
        }
      } else {
        await organization.save().then((response) => {
          router.replace(`${server}/organizations`)
        })
      }
    } catch (error) {
      setErrors(error)
      setIsLoading(false)
    }
  }

  return (
    <div className="container-fluid mt-5">
      <Link href={`${server}/organizations`}>
        <a className="btn btn-link">Go Back to List</a>
      </Link>
      {hasError(errors, 'general') && (
        <Cx.CCallout color="danger">
          {getErrorMessage(errors, 'general')}
        </Cx.CCallout>
      )}
      <Cx.CCard>
        <Cx.CCardHeader>
          {isEdit ? 'Edit organization' : 'Create organization'}
        </Cx.CCardHeader>
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
                value={organizationState.name}
                disabled={isLoading}
                onChange={(e) => {
                  const newOrganizationState = { ...organizationState }
                  newOrganizationState.name = e.target.value
                  setOrganizationState(newOrganizationState)
                }}
              />
              {hasError(errors, 'name') && (
                <Cx.CFormFeedback invalid>
                  {getErrorMessage(errors, 'name')}
                </Cx.CFormFeedback>
              )}
            </Cx.CCol>
            <Cx.CCol md="6">
              <Cx.CFormLabel htmlFor="is_featured">Is Featured?</Cx.CFormLabel>
              <Select
                instanceId="is_featured"
                name="is_featured"
                isDisabled={isLoading}
                options={organization.getIsFeaturedStatus()}
                value={organizationState.is_featured}
                onChange={selectIsFeaturedHandler}
              />
            </Cx.CCol>
            <Cx.CCol md="6">
              <Cx.CFormLabel htmlFor="owner_id">Owner</Cx.CFormLabel>
              <Select
                instanceId="owner_id"
                name="owner_id"
                isDisabled={isLoading}
                isMulti={true}
                placeholder={'Select Owner(s)'}
                options={userList}
                value={organizationState.owner_id}
                onChange={selectOwnerIdHandler}
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

export default OrganizationForm
