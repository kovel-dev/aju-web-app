import React from 'react'

const TextInputLogin = ({
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
}) => {
  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          className={`block text-sm font-medium ${
            disabled ? 'text-gray-400' : 'text-gray-700'
          }`}
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className="appearance-none block w-full px-3 py-2 border-1 border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
      />
    </div>
  )
}

export default TextInputLogin
