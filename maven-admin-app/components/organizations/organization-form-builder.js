import React, { useState, useRef, useEffect } from 'react'
import { server } from '../../lib/config/server'
import FormBuilder from '../../components/form/form-builder'
import { useRouter } from 'next/router'
import { hasError, getErrorMessage } from '../../lib/validations/validations'
import { validateOrganizationForm } from '../../lib/validations/organization-validations'
import {
  getOrganizationByRef,
  processUserForm,
} from '../../lib/handlers/handlers'
import Notification from '../../components/shared/notification'
import Organization from '../../lib/models/organization'
import Meta from '../meta'

function OrgFormBuilder(props) {
  let organization = new Organization({})
  const isEdit = props.edit ? true : false
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [modalState, setModalState] = useState(organization.getValues())

  const router = useRouter()
  const fieldValues = {}
  //Get Model Schema
  const schema = Organization.getSchema(isEdit)

  let url = `${server}/api/organizations/create`
  if (isEdit) {
    const query = router.query
    const refNumber = query.id
    url = `${server}/api/organizations/${refNumber}/edit`
  }

  //organization Edit
  if (isEdit) {
    useEffect(async () => {
      setIsLoading(true)
      const query = router.query

      if (query) {
        const refNumber = query.id
        await getOrganizationByRef(refNumber)
          .then((value) => {
            organization = new Organization(value)
            setModalState(organization)
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
    await validateOrganizationForm(enteredData)
      .then(async (value) => {
        await processUserForm(url, enteredData)
          .then((response) => {
            // Add success message
            router.replace(`${server}/organizations`)
          })
          .catch((error) => {
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
  return (
    <>
      <Meta
        title={`${props.edit ? 'Edit ' : 'Add '}Organizations | Maven Admin`}
        keywords=""
        description=""
      />
      {hasError(errors, 'general') && (
        <Notification msg={getErrorMessage(errors, 'general')} />
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

export default OrgFormBuilder
