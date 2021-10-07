// import axios from "axios";
// import Link from "next/link";
// import * as Cx from "@coreui/react";
// import { useState, useRef, useEffect } from "react";
// import { useRouter } from "next/router";
// import { server } from "../../lib/config/server";
// import { validateUserForm, hasError, getErrorMessage } from "../../lib/validations/validations";
// import { getUserByRefHandler, processUserForm } from "../../lib/handlers/handlers";

import * as Cx from '@coreui/react'
import Link from 'next/link'
import Select from 'react-select'
import User from '../../lib/models/user'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { server } from '../../lib/config/server'
import { getErrorMessage, hasError } from '../../lib/validations/validations'

function UserForm(props) {
  const isEdit = props.edit ? true : false
  const router = useRouter()
  let user = new User({})

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [userState, setUserState] = useState(user.getValues())

  useEffect(async () => {
    if (isEdit) {
      setIsLoading(true)
      const query = router.query

      if (query) {
        const refNumber = query.id
        await user
          .getUserByRef(refNumber)
          .then((userInfo) => {
            user = new User(userInfo)
            setUserState(user)
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

  const selectRoleHandler = (selectedOption) => {
    const newUserState = { ...userState }
    newUserState.role = selectedOption
    setUserState(newUserState)
  }

  const submitHandler = async () => {
    setIsLoading(true)
    setErrors({})

    user = new User(userState)
    try {
      if (isEdit) {
        const query = router.query

        if (query) {
          const refNumber = query.id
          await user.update(refNumber).then((response) => {
            router.replace(`${server}/users`)
          })
        }
      } else {
        await user.save().then((response) => {
          router.replace(`${server}/users`)
        })
      }
    } catch (error) {
      setErrors(error)
      setIsLoading(false)
    }
  }

  return (
    <div className="mt-5 container-fluid">
      <Link href={`${server}/users`}>
        <a className="btn btn-link">Go Back to List</a>
      </Link>
      {hasError(errors, 'general') && (
        <Cx.CCallout color="danger">
          {getErrorMessage(errors, 'general')}
        </Cx.CCallout>
      )}
      <Cx.CCard>
        <Cx.CCardHeader>{isEdit ? 'Edit User' : 'Create User'}</Cx.CCardHeader>
        <Cx.CCardBody>
          <Cx.CForm className="row g-3" onSubmit={submitHandler}>
            <Cx.CCol md="6">
              <Cx.CFormLabel htmlFor="first_name">First Name</Cx.CFormLabel>
              <Cx.CFormControl
                id="first_name"
                name="first_name"
                type="text"
                invalid={hasError(errors, 'first_name') ? true : false}
                disabled={isLoading}
                value={userState.first_name}
                onChange={(e) => {
                  const newUserState = { ...userState }
                  newUserState.first_name = e.target.value
                  setUserState(newUserState)
                }}
              />
              {hasError(errors, 'first_name') && (
                <Cx.CFormFeedback invalid>
                  {getErrorMessage(errors, 'first_name')}
                </Cx.CFormFeedback>
              )}
            </Cx.CCol>
            <Cx.CCol md="6">
              <Cx.CFormLabel htmlFor="last_name">Last Name</Cx.CFormLabel>
              <Cx.CFormControl
                id="last_name"
                name="last_name"
                type="text"
                required
                disabled={isLoading}
                invalid={hasError(errors, 'last_name') ? true : false}
                value={userState.last_name}
                onChange={(e) => {
                  const newUserState = { ...userState }
                  newUserState.last_name = e.target.value
                  setUserState(newUserState)
                }}
              />
              {hasError(errors, 'last_name') && (
                <Cx.CFormFeedback invalid>
                  {getErrorMessage(errors, 'last_name')}
                </Cx.CFormFeedback>
              )}
            </Cx.CCol>
            <Cx.CCol md="6">
              <Cx.CFormLabel htmlFor="email">Email</Cx.CFormLabel>
              <Cx.CFormControl
                id="email"
                name="email"
                type="email"
                required
                disabled={isLoading || isEdit}
                invalid={hasError(errors, 'email') ? true : false}
                value={userState.email}
                onChange={(e) => {
                  const newUserState = { ...userState }
                  newUserState.email = e.target.value
                  setUserState(newUserState)
                }}
              />
              {hasError(errors, 'email') && (
                <Cx.CFormFeedback invalid>
                  {getErrorMessage(errors, 'email')}
                </Cx.CFormFeedback>
              )}
            </Cx.CCol>
            <Cx.CCol md="6">
              <Cx.CFormLabel htmlFor="role">Role</Cx.CFormLabel>
              <Cx.CFormSelect
                id="role"
                name="role"
                disabled={isLoading}
                invalid={hasError(errors, 'type') ? true : false}
                value={userState.role}
                onChange={(e) => {
                  const newUserState = { ...userState }
                  newUserState.role = e.target.value
                  setUserState(newUserState)
                }}
              >
                <option value="">Select Role</option>
                {Object.keys(user.getAdminRoleTypes()).map(function (
                  key,
                  index
                ) {
                  return (
                    <option value={key} key={index}>
                      {user.getAdminRoleTypes()[key]}
                    </option>
                  )
                })}
              </Cx.CFormSelect>
              {hasError(errors, 'role') && (
                <Cx.CFormFeedback invalid>
                  {getErrorMessage(errors, 'role')}
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
    </div>
  )
}

export default UserForm
