import React, { useState, useEffect } from 'react'
import Organization from '../../../lib/models/organization'
import User from '../../../lib/models/user'
import File from './file'
import Heading from './heading'

function Select(props) {
  const [value, setValue] = useState('')
  const [error, setErrors] = useState('')
  const [otherOrganization, setOtherOrganization] = useState([])
  const [addFields, setAddFields] = useState(false)
  const [otherFields, setOtherFields] = useState([])
  const [Array, setArray] = useState([])
  const [count, setCount] = useState(0)
  const [displayComponent, setDisplayComponent] = useState(true)

  useEffect(() => {
    const fieldValues = { ...props.fieldValues }
    if (props.conditionField) {
      let comp = props.conditionField
      if (fieldValues[comp] == props.conditionFalseValue) {
        setDisplayComponent(false)
      } else {
        setDisplayComponent(true)
      }
    }

    setValue(props.value)
    if (props.value === 'series') {
      setAddFields(true)
      const intialCount =
        fieldValues.seriesMeta.length > 0
          ? setCount(fieldValues.seriesMeta.length)
          : ''
    } else {
      setAddFields(false)
      const newState = { ...props.fieldValues }
      newState['seriesMeta'] = ''
    }
  }, [props])

  useEffect(async () => {
    if (props.label === 'Organization') {
      try {
        await Organization.getOrganizationsForSelect().then((result) => {
          setOtherOrganization(result.data)
        })
      } catch (error) {
        setErrors(error)
      }
    }
    if (props.label === 'Owner') {
      try {
        await User.getAdminUsersForSelect().then((result) => {
          setOtherOrganization(result.data)
        })
      } catch (error) {
        setErrors(error)
      }
    }
    if (props.id === 'linked_org') {
      try {
        await Organization.getOrganizationsWithNoOwnershipForSelect().then(
          (result) => {
            setOtherOrganization(result.data)
          }
        )
      } catch (error) {
        setErrors(error)
      }
    }

    const newState = { ...props.fieldValues }
    if (newState['seriesMeta']) {
      setOtherFields(newState['seriesMeta'])
    }
  }, [props])

  const AddHandler = (e) => {
    e.preventDefault()
    setCount(count + 1)
    setAddFields(true)
    if (otherFields.length === 0) {
      const productMetaArray = []
      const data = { title: '', description: '', file: '', link: '' }
      productMetaArray.push(data)
      setOtherFields([productMetaArray])
    } else {
      const productMetaArray = []
      const data = { title: '', description: '', file: '', link: '' }
      productMetaArray.push(data)
      setOtherFields([...otherFields, productMetaArray])
    }
  }

  const AddContentHandler = (e) => {
    e.preventDefault()
    setCount(count + 1)
    setAddFields(true)
    const indexData = { ...otherFields }
    const lastIndex = Object.keys(indexData).length - 1
    const productMetaArray = []
    const data = {
      title: '',
      description: indexData[lastIndex][0].description,
      file: indexData[lastIndex][0].file,
      link: indexData[lastIndex][0].link,
    }
    productMetaArray.push(data)
    setOtherFields([...otherFields, productMetaArray])
  }

  const deleteHandler = (e, i) => {
    e.preventDefault()
    setAddFields(true)
    let newotherFields = [...otherFields]
    newotherFields.splice(i, 1)
    setOtherFields(newotherFields)
    setCount(count - 1)
  }

  const submitHandler = (e) => {
    e.preventDefault()
    const productMetaArray = []
    ;[...otherFields].map((item, index) => {
      const productMetaArray1 = []
      const title = document.getElementById(`title` + index).value
      const description = document.getElementById(`description` + index).value
      const file = document.getElementById(`file` + index).value
      const link = document.getElementById(`link` + index).value
      const data = {
        title: title,
        description: description,
        file: file,
        link: link,
      }
      productMetaArray1.push(data)
      productMetaArray.push(productMetaArray1)
    })
    const newTagState = { ...props.fieldValues }
    newTagState['seriesMeta'] = productMetaArray
    props.fieldValuesHandler(newTagState)
  }

  return (
    <>
      {displayComponent && (
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
              <select
                id={props.id}
                name={props.name}
                autoComplete={props.name}
                required={props.isRequired ? true : false}
                className={`max-w-lg block focus:ring-primary focus:border-primary w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                  props.invalid
                    ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500'
                    : ''
                }`}
                value={value}
                onChange={(e) => {
                  const newTagState = { ...props.fieldValues }
                  newTagState[props.id] = e.target.value
                  let index = e.nativeEvent.target.selectedIndex
                  let selected_lable = e.nativeEvent.target[index].text
                  if (props.id === 'affiliation_id') {
                    newTagState['affiliation_name'] = selected_lable
                  }
                  props.fieldValuesHandler(newTagState)
                }}
              >
                <option value="">Select One</option>
                {props.options.map((item, key) => (
                  <option
                    key={item.key}
                    value={item.key}
                    disabled={item.disable ? 'disabled' : ''}
                  >
                    {item.value}
                  </option>
                ))}
                {otherOrganization &&
                  otherOrganization.map((item, key) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
              </select>
              {props.invalid && (
                <p className="mt-2 text-sm text-red-600" id="email-error">
                  {props.errMsg}
                </p>
              )}
            </div>
          </div>
          {addFields && (
            <>
              <Heading
                title="Series Data"
                subHeading="Add Information for Series Data"
              />
              <div className="">
                {otherFields &&
                  otherFields.map((item, index) => {
                    return (
                      <div
                        className="p-8 mt-4 border-2 border-gray-600 border-opacity-25"
                        key={index + '-tile'}
                      >
                        <div>
                          <p className="font-semibold leading-4 text-sm h-4 overflow-y-hidden">
                            {index + 1}
                          </p>
                          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
                            <label
                              htmlFor="text"
                              className="block text-lg mb-2 sm:text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                            >
                              Title*
                            </label>
                            <div className="mt-1 sm:mt-0 sm:col-span-2">
                              <input
                                type="text"
                                id={`title` + index}
                                value={item[0].title}
                                required
                                className="max-w-lg shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
                                onChange={(e, i) => {
                                  const newTagState = { ...item }
                                  newTagState[0].title = e.target.value
                                  setArray(newTagState)
                                  const t = { ...otherFields }
                                  t[i] = newTagState
                                }}
                              />
                            </div>
                          </div>

                          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
                            <label
                              htmlFor="text"
                              className="block text-lg mb-2 sm:text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                            >
                              Description
                            </label>
                            <div className="mt-4 sm:mt-4 sm:col-span-2">
                              <textarea
                                id={`description` + index}
                                value={item[0].description}
                                className="max-w-lg shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
                                onChange={(e, i) => {
                                  const newTagState = { ...item }
                                  newTagState[0].description = e.target.value
                                  setArray(newTagState)
                                  const t = { ...otherFields }
                                  t[i] = newTagState
                                }}
                              />
                            </div>
                          </div>
                          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
                            <label
                              htmlFor="text"
                              className="block text-lg mb-2 sm:text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                            >
                              Link
                            </label>
                            <div className="mt-4 sm:mt-4 sm:col-span-2">
                              <input
                                type="text"
                                id={`link` + index}
                                value={item[0].link}
                                className="max-w-lg shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
                                onChange={(e, i) => {
                                  const newTagState = { ...item }
                                  newTagState[0].link = e.target.value
                                  setArray(newTagState)
                                  const t = { ...otherFields }
                                  t[i] = newTagState
                                }}
                              />
                            </div>
                          </div>

                          <File
                            label="Thumbnail Image"
                            id={`file` + index}
                            name={`file` + index}
                            value={item[0].file}
                            fieldValues={item}
                            fieldValuesHandler={setArray}
                            key={index}
                            index={index}
                            otherFields={otherFields}
                            productMeta="true"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            deleteHandler(e, index)
                          }}
                          className="text-red-700 float-right"
                        >
                          delete
                        </button>
                      </div>
                    )
                  })}
                <div className="m-2 flex flex-row-reverse">
                  <button
                    className="bg-primary ml-4 py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    onClick={submitHandler}
                  >
                    Save
                  </button>
                  <button
                    className="bg-primary ml-4 py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    onClick={AddHandler}
                  >
                    Add
                  </button>
                  <button
                    className={`bg-primary ml-4 py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                      count == 0 ? `invisible` : ``
                    }`}
                    onClick={AddContentHandler}
                  >
                    Copy Last Item
                  </button>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>
  )
}

export default Select
