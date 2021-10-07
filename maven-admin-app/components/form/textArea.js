import React from 'react'

const TextArea = ({
  label,
  id,
  name,
  value,
  onChange,
  placeholder,
  required,
  disabled,
  autoComplete,
  instructions,
  rows,
}) => {
  return (
    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
        >
          {label}
        </label>
      )}
      <div className="mt-1 sm:mt-0 sm:col-span-2">
        <textarea
          id="about"
          name={name}
          rows={rows}
          className="max-w-lg block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-1 border-gray-300 rounded-md resize-none focus:outline-none"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
        ></textarea>
        {instructions && (
          <p className="mt-2 text-sm text-gray-500">{instructions}</p>
        )}
      </div>
    </div>
  )
}

export default TextArea
