import React, { useState, useEffect } from 'react'
import Host from '../../../lib/models/host'

function hiddenStatic(props) {
  const [value, setValue] = useState('')
  const [otherFields, setOtherFields] = useState([])
  const [Array, setArray] = useState([])
  const [count, setCount] = useState(0)
  const [data, setData] = useState([])
  const [selectOptions, setSelectOptions] = useState({})

  useEffect(() => {
    setValue(props.value)
  }, [props])

  useEffect(async () => {
    try {
      await Host.getHostsForSelect().then((result) => {
        setSelectOptions(result.data)
        const newState = { ...props.fieldValues }
        if (newState['hostRoleMeta']) {
          setOtherFields(newState['hostRoleMeta'])
        }
      })
    } catch (error) {
      console.log(error, 'error')
    }
  }, [])

  const AddHandler = (e) => {
    e.preventDefault()
    setCount(count + 1)
    if (otherFields.length === 0) {
      const productMetaArray = []
      const data = { value: '', role: '' }
      productMetaArray.push(data)
      setOtherFields([productMetaArray])
    } else {
      const productMetaArray = []
      const data = { value: '', role: '' }
      productMetaArray.push(data)
      setOtherFields([...otherFields, productMetaArray])
    }
  }

  const deleteHandler = (e, i) => {
    e.preventDefault()
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
      const value = document.getElementById(
        props.subType + `_value` + index
      ).value
      const role = document.getElementById(
        props.subType + `_role` + index
      ).value

      let data = { value: value, role: role }

      productMetaArray1.push(data)
      productMetaArray.push(productMetaArray1)
    })

    const newTagState = { ...props.fieldValues }
    newTagState[props.subType] = productMetaArray
    props.fieldValuesHandler(newTagState)
  }

  return (
    <>
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
                      Host*
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <select
                        id={props.subType + `_value` + index}
                        name="value"
                        autoComplete="value"
                        required="value"
                        className={`max-w-lg block focus:ring-primary focus:border-primary w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                          props.invalid
                            ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500'
                            : ''
                        }`}
                        value={item[0].value}
                        onChange={(e, i) => {
                          const newTagState = { ...item }
                          newTagState[0].value = e.target.value
                          setArray(newTagState)
                          const t = { ...otherFields }
                          t[i] = newTagState
                        }}
                      >
                        <option value="">Select One</option>
                        {selectOptions.map((item, key) => (
                          <option
                            key={item.value}
                            value={item.value}
                            disabled={item.disable ? 'disabled' : ''}
                          >
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start mt-3">
                    <label
                      htmlFor="text"
                      className="block text-lg mb-2 sm:text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Role*
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <select
                        id={props.subType + `_role` + index}
                        name="role"
                        autoComplete="role"
                        required="role"
                        className={`max-w-lg block focus:ring-primary focus:border-primary w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                          props.invalid
                            ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500'
                            : ''
                        }`}
                        value={item[0].role}
                        onChange={(e, i) => {
                          const newTagState = { ...item }
                          newTagState[0].role = e.target.value
                          setArray(newTagState)
                          const t = { ...otherFields }
                          t[i] = newTagState
                        }}
                      >
                        <option value="">Select One</option>
                        <option value="host">Host</option>
                        <option value="guest">Guest</option>
                        <option value="instructor">Instructor</option>
                        <option value="speakers bureau">Speakers Bureau</option>
                      </select>
                    </div>
                  </div>
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
        </div>
      </div>
    </>
  )
}

export default hiddenStatic
