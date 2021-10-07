import { Field, ErrorMessage, useFormikContext } from 'formik'
import React, { useState } from 'react'
import AssetsModal from '../../assets/modal'

function FileField(props) {
  const attr = props.attr
  const name = props.name
  const formikProps = useFormikContext()
  const [showAssetManagerModal, setShowAssetManagerModal] = useState(false)

  const processAssetManagerHandler = () => {
    setShowAssetManagerModal(true)
  }
  const closeModalHandler = () => {
    setShowAssetManagerModal(false)
  }
  const setFileLink = (e, link) => {
    e.preventDefault()
    formikProps.setFieldValue(name, link)
    setShowAssetManagerModal(false)
  }
  return (
    <>
      <div className="pl-4 py-3 sm:border-b sm:border-gray-200" key={name}>
        {showAssetManagerModal && (
          <AssetsModal
            setFileLink={setFileLink}
            closeModalHandler={closeModalHandler}
          />
        )}
        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
          <label
            htmlFor={name}
            className="block text-lg mb-2 sm:text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
          >
            {attr.label}
          </label>
          <div className="mt-1 sm:mt-0 sm:col-span-2 inline-flex">
            <Field
              name={name}
              type="text"
              className={`max-w-lg shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md`}
            />
            <button
              type="button"
              className="bg-primary ml-4 py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              onClick={() => processAssetManagerHandler()}
            >
              Select
            </button>
            <p className="mt-2 text-sm text-red-600" id="email-error">
              <ErrorMessage name={name} />
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default FileField
