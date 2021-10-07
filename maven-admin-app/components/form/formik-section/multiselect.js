import React, { useState } from 'react'
import { useFormikContext, ErrorMessage } from 'formik'
import Select from 'react-select'

function MultiSelectField(props) {
  const attr = props.attr
  const name = props.name
  const options = props.options
  const formikProps = useFormikContext()

  const setFormikValues = (value) => {
    formikProps.setFieldValue(name, value)
  }
  return (
    <>
      <div className="pl-4 py-3 sm:border-b sm:border-gray-200" key={name}>
        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
          <label
            htmlFor={name}
            className="block text-lg mb-2 sm:text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
          >
            {attr.label}
          </label>
          <div className="mt-1 sm:mt-0 sm:col-span-2">
            <Select
              className={`basic-multi-select max-w-lg block focus:ring-primary focus:border-primary w-full shadow-sm sm:text-sm border-gray-300 rounded-md`}
              id={name}
              name={name}
              options={options}
              isMulti={attr.multi}
              onChange={setFormikValues}
              value={formikProps.values[name]}
            />
            <p className="mt-2 text-sm text-red-600" id="email-error">
              <ErrorMessage name={name} />
              {formikProps.errors[name]}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default MultiSelectField
