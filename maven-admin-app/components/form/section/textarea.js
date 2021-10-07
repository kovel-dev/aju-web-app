import React, { useState, useEffect } from 'react'

function TextArea(props) {
  const [value, setValue] = useState('')

  useEffect(() => {
    setValue(props.value)
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
          className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
        >
          {props.label}
          {props.isRequired ? '*' : ''}
        </label>
        <div className="mt-1 sm:mt-0 sm:col-span-2">
          <textarea
            key={props.id}
            id={props.id}
            name={props.name}
            rows={3}
            className="max-w-lg shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
            defaultValue={value}
            required={props.isRequired ? true : false}
            onChange={(e) => {
              const newTagState = { ...props.fieldValues }
              newTagState[props.id] = e.target.value
              props.fieldValuesHandler(newTagState)
            }}
          />
          {props.invalid && (
            <p className="mt-2 text-sm text-red-600" id="email-error">
              {props.errMsg}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default TextArea
