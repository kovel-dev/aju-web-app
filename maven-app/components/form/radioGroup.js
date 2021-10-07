import { useState, useEffect } from 'react'

const RadioGroup = ({ label, description, name, options, valueProp }) => {
  const [userInput, setUserInput] = useState('')
  return (
    <div className="pt-6 sm:pt-5">
      <div role="group" aria-labelledby={'label-' + name}>
        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-baseline">
          <div>
            <div
              className="text-base font-medium text-gray-900 sm:text-sm sm:text-gray-700"
              id={'label-' + name}
            >
              {label}
            </div>
          </div>
          <div className="sm:col-span-2">
            <div className="max-w-lg">
              {description && (
                <p className="text-sm text-gray-500 mb-4">{description}</p>
              )}
              <div className="space-y-4">
                {options.map((option, index) => {
                  return (
                    <div className="flex items-center" key={'option-' + index}>
                      <input
                        id={option.toLowerCase().split(' ').join('-')}
                        name={name}
                        type="radio"
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                        value={option.toLowerCase().split(' ').join('-')}
                        onChange={(e) => {
                          setUserInput(e.target.value)
                          valueProp(e.target.value)
                        }}
                      />
                      <label
                        htmlFor={option.toLowerCase().split(' ').join('-')}
                        className="ml-3 block text-sm font-medium text-gray-700"
                      >
                        {option}
                      </label>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RadioGroup
