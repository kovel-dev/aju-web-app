import { useState, useEffect } from 'react'

const CheckboxGroup = ({ label, options, valueProp }) => {
  const [userInput, setUserInput] = useState([])

  useEffect(() => {
    valueProp(userInput)
  }, [userInput])

  const handleCheck = (e) => {
    if (document.getElementById(e.target.value).checked) {
      const newUserInput = [...userInput, e.target.value]
      setUserInput(newUserInput)
    } else {
      const newUserInput = [...userInput]
      const removeIndex = newUserInput.indexOf(e.target.value)
      newUserInput.splice(removeIndex, 1)
      setUserInput(newUserInput)
    }
  }
  return (
    <div className="pt-6 sm:pt-5">
      <div
        role="group"
        aria-labelledby={'label-' + label.toLowerCase().split(' ').join('-')}
      >
        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-baseline">
          <div>
            <div
              className="text-base font-medium text-gray-900 sm:text-sm sm:text-gray-700"
              id={'label-' + label.toLowerCase().split(' ').join('-')}
            >
              {label}
            </div>
          </div>
          <div className="mt-4 sm:mt-0 sm:col-span-2">
            <div className="max-w-lg space-y-4">
              {options.map((option, index) => {
                return (
                  <div
                    className="relative flex items-start"
                    key={'option-' + index}
                  >
                    <div className="flex items-center h-5">
                      <input
                        id={option.toLowerCase().split(' ').join('-')}
                        name={option.toLowerCase().split(' ').join('-')}
                        value={option.toLowerCase().split(' ').join('-')}
                        type="checkbox"
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        onChange={(e) => handleCheck(e)}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor={option.toLowerCase().split(' ').join('-')}
                        className="font-medium text-gray-700"
                      >
                        {option}
                      </label>
                      {/* <p className="text-gray-500">Get notified when someones posts a comment on a posting.</p> */}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckboxGroup
