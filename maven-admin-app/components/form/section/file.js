import React, { useState, useEffect } from 'react'
import TableView from '../../assets/table-view'
import AssetsModal from '../../assets/modal'

function File(props) {
  const [value, setValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [tagState, setTagState] = useState(false)
  // asset manager
  const [showAssetManagerModal, setShowAssetManagerModal] = useState(false)
  const [selectedAssetField, setSelectedAssetField] = useState(null)

  useEffect(() => {
    if (value && value == '') {
      setValue(value)
    } else {
      setValue(props.value || '')
    }
  }, [props])

  const processAssetManagerHandler = (fieldName, fieldValue) => {
    setSelectedAssetField(fieldName)
    setShowAssetManagerModal(true)
  }

  const closeModalHandler = () => {
    setShowAssetManagerModal(false)
  }

  const setFileLink = (e, link) => {
    e.preventDefault()
    //props.refValue.current = link
    setValue(link)
    setShowAssetManagerModal(false)
    const newTagState = { ...props.fieldValues }
    newTagState[selectedAssetField] = link
    props.fieldValuesHandler(newTagState)

    if (props.productMeta) {
      newTagState[0].file = link
      props.fieldValuesHandler(newTagState)
      const t = { ...props.otherFields }
      t[props.index] = newTagState
    }
  }

  const onChangeHandler = (e) => {
    const newTagState = { ...tagState }
    newTagState.selectedAssetField = e.target.value
    setTagState(newTagState)
  }

  return (
    <div
      className="py-3 sm:border-b sm:border-gray-200"
      aria-labelledby={`fm-textbox-${props.name}`}
      key={props.name}
    >
      {showAssetManagerModal && (
        <AssetsModal
          setFileLink={setFileLink}
          closeModalHandler={closeModalHandler}
          showPDF={props.showPDF ? true : false}
        />
      )}
      <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
        <label
          htmlFor={props.id}
          className="block text-lg mb-2 sm:text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
        >
          {props.label}
          {props.isRequired ? '*' : ''}
        </label>
        <div className="mt-1 sm:mt-0 sm:col-span-2 inline-flex">
          <input
            id={props.id}
            name={props.name}
            type="text"
            autoComplete={props.name}
            required={props.isRequired ? true : false}
            className={`flex-1 block max-w-lg w-full shadow-sm focus:primary focus:border-primary sm:text-sm border-gray-300 rounded-md ${
              props.width == 1 ? 'sm:max-w-xs' : ''
            } ${
              props.invalid
                ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500'
                : ''
            }`}
            // defaultValue={props.value ? props.value : value}
            value={props.value ? props.value : value}
            onChange={(e) => {
              const newFieldValues = { ...props.fieldValues }
              newFieldValues[props.id] = e.target.value
              props.fieldValuesHandler(newFieldValues)

              if (props.productMeta) {
                newFieldValues[0].file = e.target.value
                props.fieldValuesHandler(newFieldValues)
                const t = { ...props.otherFields }
                t[props.index] = newFieldValues
              }
            }}
          />
          <button
            type="button"
            className="bg-primary ml-4 py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            disabled={isLoading}
            onClick={() => processAssetManagerHandler(props.name, value)}
          >
            {isLoading ? '' : 'Select'}
          </button>
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

export default File
