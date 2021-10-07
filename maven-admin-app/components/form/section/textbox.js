import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import Organization from '../../../lib/models/organization'

function TextBox(props) {
  const [value, setValue] = useState('')
  const [slugError, setSlugError] = useState(false)
  const router = useRouter()

  useEffect(async () => {
    setValue(props.value || '')

    if (props.id == 'slug') {
      const slugValue = props.value || ''
      const priceRegex = /^[a-zA-Z0-9-_]+$/
      if (
        props.value &&
        props.value != '' &&
        slugValue.search(priceRegex) === -1
      ) {
        setSlugError(true)
      } else {
        setSlugError(false)
      }
    } else if (props.id == 'linked_org_name') {
      const query = router.query

      if (query) {
        const refNumber = query.id

        if (refNumber) {
          try {
            await Organization.getOrganizationByOwnerId(refNumber).then(
              (result) => {
                setValue(result.name)
              }
            )
          } catch (error) {
            console.log(error)
          }
        }
      }
    }
  }, [props])

  return (
    <div
      className="py-3 sm:border-b sm:border-gray-200"
      aria-labelledby={`fm-textbox-${props.name}`}
      key={props.name}
    >
      <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
        <label
          htmlFor={props.id}
          className="block text-lg mb-2 sm:text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
        >
          {props.label}
          {props.isRequired ? '*' : ''}
        </label>
        <div className="mt-1 sm:mt-0 sm:col-span-2">
          <input
            key={props.id}
            id={props.id}
            name={props.name}
            type="text"
            value={value}
            autoComplete={props.name}
            required={props.isRequired ? true : false}
            className={`max-w-lg shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md  ${
              props.invalid
                ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500'
                : ''
            }`}
            onChange={(e) => {
              const newTagState = { ...props.fieldValues }
              newTagState[props.id] = e.target.value
              if (props.name == 'name') {
                if (!props.slugEditFlag) {
                  const slug = newTagState.name
                    .toLowerCase()
                    .replace(/ /g, '-')
                    .replace(/[^\w-]+/g, '')
                  newTagState.slug = slug
                }
              }
              props.fieldValuesHandler(newTagState)
            }}
            disabled={props.disabled}
          />
          {props.invalid && (
            <p className="mt-2 text-sm text-red-600" id="email-error">
              {props.errMsg}
            </p>
          )}
          {slugError && (
            <p className="mt-2 text-sm text-red-600" id="email-error">
              Invalid Slug
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default TextBox
