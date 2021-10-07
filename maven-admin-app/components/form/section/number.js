import React, { useState, useEffect } from 'react'

function Number(props) {
  const [value, setValue] = useState('')
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
    setValue(props.value || '')
  }, [props])

  return (
    <>
      {displayComponent && (
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
                step={props.name == 'price' ? '0.01' : ''}
                type="number"
                value={value}
                autoComplete={props.name}
                required={props.isRequired ? true : false}
                className={`block max-w-lg shadow-sm focus:primary focus:border-primary sm:text-sm border-gray-300 rounded-md ${
                  props.width == 1 ? 'sm:max-w-xs' : ''
                } ${
                  props.invalid
                    ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500'
                    : ''
                }`}
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
      )}
    </>
  )
}

export default Number
