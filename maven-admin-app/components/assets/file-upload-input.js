import React from 'react'
import Asset from '../../lib/models/asset'
import { useEffect, useRef, useState } from 'react'
import { hasError, getErrorMessage } from '../../lib/validations/validations'

function FileUploadInput(props) {
  let asset = new Asset({})
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [uploadFile, setUploadFile] = useState(asset.getValues())
  const [arrayState, setArrayState] = useState()
  let array = []

  const onChangeHandler = async (event) => {
    // const newAssetState = { ...uploadFile }
    let string = ''
    if (event.target.files.length > 1) {
      for (let i = 0; i < event.target.files.length; i++) {
        const newAssetState = { ...uploadFile }
        newAssetState.upload_file = event.target.files[i]
        setUploadFile(newAssetState)
        // array.push(event.target.files[i])
        array.push(newAssetState)
        string += event.target.files[i].name + ', '
      }
      document.getElementById('file-upload-text').innerHTML = string
      setArrayState(array)
    } else {
      const newAssetState = { ...uploadFile }
      newAssetState.upload_file = event.target.files[0]
      setUploadFile(newAssetState)
      document.getElementById('file-upload-text').innerHTML =
        event.target.files[0].name
    }
  }

  const processFormHandler = async () => {
    try {
      setIsLoading(true)
      setErrors({})
      const assets = []
      if (!uploadFile.upload_file) {
        setIsLoading(false)
        window.alert('No File Selected to Upload!!')
      } else {
        if (arrayState && arrayState.length > 1) {
          for (const key in arrayState) {
            let asset = new Asset(arrayState[key])
            await asset.save().then(async (response) => {
              setUploadFile(asset.getValues())
            })
          }
          props.refreshPage()
          setIsLoading(false)
        } else {
          let asset = new Asset(uploadFile)

          await asset.save().then(async (response) => {
            props.refreshPage()
            setUploadFile(Asset.getValues())
            setIsLoading(false)
          })
        }
      }
    } catch (error) {
      console.log(error)
      setErrors(error)
      setIsLoading(false)
    }
  }

  return (
    <>
      {isLoading && (
        <div className="text-center mt-5">
          {/* Uploading {uploadFile.upload_file.name} ... */}
          Uploading ...
        </div>
      )}
      {hasError(errors, 'general') && (
        <span>{getErrorMessage(errors, 'general')}</span>
      )}
      {!isLoading && (
        <>
          <div className="sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
            <div className="mt-1 sm:mt-0 sm:col-span-2">
              <div className="max-w-xlg flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                    >
                      <span>Select a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        onChange={onChangeHandler}
                        multiple
                      />
                    </label>
                    <p className="pl-1" id="file-upload-text">
                      and click on upload button
                    </p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG/JPG (max 10MB), MP4(max 100MB)
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center my-4">
            <button
              type="submit"
              className="w-44 px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark"
              onClick={() => processFormHandler()}
            >
              Upload
            </button>
          </div>
        </>
      )}
    </>
  )
}

export default FileUploadInput
