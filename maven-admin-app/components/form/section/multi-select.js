import React, { useEffect, useState } from 'react'

import Select from 'react-select'
import { useRouter } from 'next/router'
import Tag from '../../../lib/models/tag'
import Product from '../../../lib/models/product'
import Question from '../../../lib/models/question'
import Host from '../../../lib/models/host'
import User from '../../../lib/models/user'
import Organization from '../../../lib/models/organization'

function MultiSelect(props) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectOptions, setSelectOptions] = useState({})
  const [value, setValue] = useState('')
  const [error, setErrors] = useState('')

  useEffect(() => {
    setValue(props.value)
  }, [props])

  //Check for multiselect subtype
  if (props.subType == 'tags') {
    useEffect(async () => {
      try {
        const query = router.query
        let refNumber = null

        if (query) {
          refNumber = query.id
        }
        await Tag.getTagsForSelect(refNumber).then((result) => {
          setSelectOptions(result.data)
          setIsLoading(false)
        })
      } catch (error) {
        setErrors(error)
        setIsLoading(false)
      }
    }, [])
  } else if (props.subType == 'products') {
    useEffect(async () => {
      try {
        const query = router.query
        let refNumber = null

        if (query) {
          refNumber = query.id
        }
        await Product.getProductsForSelect(refNumber).then((result) => {
          setSelectOptions(result.data)
          setIsLoading(false)
        })
      } catch (error) {
        setErrors(error)
        setIsLoading(false)
      }
    }, [])
  } else if (props.subType == 'questions') {
    useEffect(async () => {
      try {
        const query = router.query
        let refNumber = null

        if (query) {
          refNumber = query.id
        }
        await Question.getQuestionsForSelect(refNumber).then((result) => {
          setSelectOptions(result.data)
          setIsLoading(false)
        })
      } catch (error) {
        setErrors(error)
        setIsLoading(false)
      }
    }, [])
  } else if (props.subType == 'hosts') {
    useEffect(async () => {
      try {
        const query = router.query
        let refNumber = null

        if (query) {
          refNumber = query.id
        }
        await Host.getHostsForSelect(refNumber).then((result) => {
          setSelectOptions(result.data)
          setIsLoading(false)
        })
      } catch (error) {
        setErrors(error)
        setIsLoading(false)
      }
    }, [])
  } else if (props.subType == 'sponsors') {
    useEffect(async () => {
      try {
        const query = router.query
        let refNumber = null

        if (query) {
          refNumber = query.id
        }
        await Organization.getOrganizationsForSelect().then((result) => {
          setSelectOptions(result.data)
          setIsLoading(false)
        })
      } catch (error) {
        setErrors(error)
        setIsLoading(false)
      }
    }, [])
  } else if (props.subType == 'owners') {
    useEffect(async () => {
      try {
        await User.getAdminUsersForSelect().then((result) => {
          setSelectOptions(result.data)
          setIsLoading(false)
        })
      } catch (error) {
        setErrors(error)
        setIsLoading(false)
      }
    }, [])
  } else if (props.subType == 'Main tags') {
    useEffect(async () => {
      try {
        const query = router.query
        let refNumber = null

        if (query) {
          refNumber = query.id
        }
        await Tag.getTagsTypeForSelect(refNumber, 'maincategory').then(
          (result) => {
            setSelectOptions(result.data)
            setIsLoading(false)
          }
        )
      } catch (error) {
        setErrors(error)
        setIsLoading(false)
      }
    }, [])
  } else if (props.subType == 'Sub tags') {
    useEffect(async () => {
      try {
        const query = router.query
        let refNumber = null

        if (query) {
          refNumber = query.id
        }
        await Tag.getTagsTypeForSelect(refNumber, 'subcategory').then(
          (result) => {
            setSelectOptions(result.data)
            setIsLoading(false)
          }
        )
      } catch (error) {
        setErrors(error)
        setIsLoading(false)
      }
    }, [])
  } else {
    //add more effects based on which options to fetch
  }

  const selectSimilarTagsHandler = (selectedOption) => {
    const newTagState = { ...props.fieldValues }
    const fieldName = props.name
    newTagState[fieldName] = selectedOption
    props.fieldValuesHandler(newTagState)
    setValue(selectedOption)
  }

  return (
    <>
      <div
        className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start py-3 sm:border-b sm:border-gray-200"
        aria-labelledby={`fm-select-${props.name}`}
        key={props.name}
      >
        <label
          htmlFor={props.id}
          className="block text-lg mb-2 sm:text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
        >
          {props.label}
          {props.isRequired ? '*' : ''}
        </label>
        <div className="mt-1 sm:mt-0 sm:col-span-2">
          <Select
            id={props.id}
            instanceId={props.instanceId}
            inputId={props.instanceId}
            name={props.name}
            autoComplete={props.name}
            required={props.isRequired ? true : false}
            className={`basic-multi-select max-w-lg block focus:ring-primary focus:border-primary w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
              props.invalid
                ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500'
                : ''
            }`}
            isMulti
            options={selectOptions}
            value={value}
            onChange={selectSimilarTagsHandler}
          />
        </div>
      </div>
    </>
  )
}

export default MultiSelect
