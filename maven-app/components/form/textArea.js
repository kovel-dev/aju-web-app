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
  error,
}) => {
  return (
    <div>
      {/* {label &&
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
        {label}
      </label>} */}
      <div className="mt-1 sm:mt-0 sm:col-span-2 relative">
        <textarea
          id={id}
          name={name}
          rows={rows}
          className="font-mont px-3 py-2 placeholder-black w-full block sm:text-lg border-gray-75 border resize-none focus:outline-none rounded-sm"
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

export default TextArea
