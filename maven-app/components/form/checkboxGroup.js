import { useState, useEffect } from 'react'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const CheckboxGroup = ({
  id,
  label,
  options,
  valueProp,
  hideLabel,
  speaker,
  filter,
  disabled,
  error,
  errorClass,
}) => {
  const [userInput, setUserInput] = useState([])
  useEffect(() => {
    valueProp(userInput)
  }, [userInput])

  const handleCheck = (e) => {
    if (document.getElementById(e.target.id).checked) {
      const newUserInput = { ...userInput }
      newUserInput[e.target.id] = document.getElementById(e.target.id).checked
      setUserInput(newUserInput)
      if (filter) {
        document
          .getElementById(e.target.id + '-label')
          .classList.remove('bg-blue-450')
        document
          .getElementById(e.target.id + '-label')
          .classList.add('bg-blue-850')
      }
    } else {
      const newUserInput = { ...userInput }
      newUserInput[e.target.id] = document.getElementById(e.target.id).checked
      setUserInput(newUserInput)
      if (filter) {
        document
          .getElementById(e.target.id + '-label')
          .classList.add('bg-blue-450')
        document
          .getElementById(e.target.id + '-label')
          .classList.remove('bg-blue-850')
      }
    }
  }
  return (
    <div>
      <div role="group">
        <div className="sm:items-baseline">
          {!hideLabel && (
            <div>
              <div
                className="text-base font-medium text-gray-900 sm:text-sm sm:text-gray-700"
                id={'label-' + label.toLowerCase().split(' ').join('-')}
              >
                {label}
              </div>
            </div>
          )}
          <div className="mt-4 sm:mt-0">
            <div
              className={`${
                filter
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-8'
                  : ''
              }`}
            >
              {options.map((option, index) => {
                return (
                  <div className="relative flex" key={'option-' + index}>
                    <div
                      className={`${
                        filter ? 'hidden' : 'flex'
                      } items-center justify-center h-5`}
                    >
                      <input
                        id={option.id}
                        name={option.name}
                        value={option.value}
                        type="checkbox"
                        disabled={disabled}
                        defaultChecked={option.checked}
                        className={`focus:ring-indigo-500 text-indigo-600 border-gray-300 rounded absolute opacity-0 h-7 w-7`}
                        onChange={(e) => handleCheck(e)}
                      />
                      <span
                        className="rounded-sm h-7 w-7 bg-white custom-checkbox mt-2 border border-gray-75 text-white flex items-center justify-center"
                        id={option.id + '-checkbox'}
                      >
                        <FontAwesomeIcon icon={faCheck} />
                      </span>
                    </div>
                    <div
                      className={`${
                        filter
                          ? 'bg-blue-450 flex items-center justify-center rounded-sm cursor-pointer w-full'
                          : 'ml-3'
                      }`}
                      id={option.id + '-label'}
                    >
                      <label
                        id={option.id + '-label'}
                        htmlFor={option.id}
                        className={`font-medium font-mont 
                          ${speaker ? 'text-sm' : ''} 
                          ${
                            filter
                              ? 'text-white py-3 block w-full text-center font-semibold'
                              : ''
                          }
                          ${option.errorClass}
                        `}
                      >
                        {option.label}
                        {option.privacyLink && (
                          <a
                            href={option.privacyLink}
                            className="underline"
                            target="_blank"
                            rel="noreferrer"
                          >
                            Terms of Service and Privacy Policy
                          </a>
                        )}
                      </label>
                      {/* <p className="text-gray-500">Get notified when someones posts a comment on a posting.</p> */}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        {error && (
          <span className="bg-red-150 text-white h-8 w-8 inline-flex items-center justify-center text-xl absolute ml-1 top-1.5 sm:top-2 right-1.5">
            !
          </span>
        )}
        {error && <p className="text-red-150 text-xs mt-2 px-3">{error}</p>}
      </div>
    </div>
  )
}

export default CheckboxGroup
