import React from 'react'

const SelectInput = ({
  label,
  id,
  name,
  options,
  value,
  onChange,
  placeholder,
}) => {
  return (
    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
      >
        {label}
      </label>
      <div className="mt-1 sm:mt-0 sm:col-span-2">
        <select
          id={id}
          className="max-w-lg block focus:ring-indigo-500 focus:border-indigo-500 w-full sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
          name={name}
          value={value}
          onChange={onChange}
        >
          <option value="" disabled hidden selected={true}>
            {placeholder}
          </option>
          {options &&
            options.map((option) => (
              <option key={option.toLowerCase().split(' ').join('-')}>
                {option}
              </option>
            ))}
        </select>
      </div>
    </div>
  )
}

export default SelectInput
