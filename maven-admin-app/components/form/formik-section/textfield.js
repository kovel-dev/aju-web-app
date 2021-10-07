import React from 'react'
import { Field, ErrorMessage } from 'formik'

function TextField(props) {
  const attr = props.attr
  const name = props.name
  return (
    <>
      <div className="py-3 pl-4 sm:border-b sm:border-gray-200" key={name}>
        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
          <label
            htmlFor={name}
            className="block mb-2 text-lg font-medium text-gray-700 sm:text-sm sm:mt-px sm:pt-2"
          >
            {attr.label}
          </label>
          <div className="mt-1 sm:mt-0 sm:col-span-2">
            <Field
              name={name}
              type="text"
              className={`max-w-lg shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md`}
            />
            <p className="mt-2 text-sm text-red-600" id="email-error">
              <ErrorMessage name={name} />
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default TextField
