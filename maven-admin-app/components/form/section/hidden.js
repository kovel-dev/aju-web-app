import React, { useState, useEffect } from 'react'
import { getErrorMessage, hasError } from '../../../lib/validations/validations'
import File from './file'
import TextBox from './textbox'

function Hidden(props) {
  const [value, setValue] = useState('')
  const [otherFields, setOtherFields] = useState([])
  const [Array, setArray] = useState([])
  const [count, setCount] = useState(0)

  useEffect(() => {
    setValue(props.value)
  }, [props])

  useEffect(async () => {
    const newState = { ...props.fieldValues }
    if (newState[props.subType]) {
      setOtherFields(newState[props.subType])
    }
  }, [])

  const AddHandler = (e) => {
    e.preventDefault()
    setCount(count + 1)
    if (otherFields.length === 0) {
      const productMetaArray = []
      const data = { file: '', title: '' }
      productMetaArray.push(data)
      setOtherFields([productMetaArray])
    } else {
      const productMetaArray = []
      const data = { file: '', title: '' }
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
      const file = document.getElementById(
        props.subType + `_s_file` + index
      ).value

      let data = { file: file }
      if (props.subType == 'sponsorMaterialMeta') {
        const text = document.getElementById(
          props.subType + `_s_text` + index
        ).value

        data = { file: file, title: text }
      }

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

                  {props.subType == 'sponsorMaterialMeta' && (
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
                          id={props.subType + `_s_text` + index}
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
                  )}

                  <File
                    label="Image"
                    id={props.subType + `_s_file` + index}
                    name={`file` + index}
                    value={item[0].file || ''}
                    isRequired="true"
                    fieldValues={item}
                    fieldValuesHandler={setArray}
                    key={index}
                    index={index}
                    otherFields={otherFields}
                    productMeta="true"
                    showPDF={props.showPDF ? true : false}
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
        </div>
      </div>
    </>
  )
}

export default Hidden
