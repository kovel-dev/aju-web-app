import React from 'react'

const TextInput = ({
  label,
  id,
  name,
  type,
  value,
  onChange,
  placeholder,
  required,
  disabled,
  autoComplete,
  width,
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
        <input
          type={type}
          name={name}
          value={value}
          id={id}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          disabled={disabled}
          // The width options: "xs", "sm", "md", lg", "xl"
          className={`max-w-${width} block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-${width} sm:text-sm border-gray-300 rounded-md border-1`}
        />
      </div>
    </div>
  )
}

export default TextInput
