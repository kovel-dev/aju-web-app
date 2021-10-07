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
  error,
  className,
  errorClass,
  halfFull,
}) => {
  return (
    <>
      {/* <label htmlFor={id} className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
        {label}
      </label> */}
      <div
        className={`mt-1 sm:mt-0 sm:col-span-2 relative md:max-w-${
          halfFull ? '1/2 lg:pr-3' : width
        }`}
      >
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
          className={`block w-full md:max-w-${width} sm:text-lg border-gray-75 border px-3 ${
            className ? className : 'py-2'
          } placeholder-black focus:outline-none rounded-sm ${errorClass}`}
        />
        {error && (
          <span className="bg-red-150 text-white h-8 w-8 inline-flex items-center justify-center text-xl absolute ml-1 top-1.5 sm:top-2 right-1.5">
            !
          </span>
        )}
        {error && <p className="px-3 mt-2 text-xs text-red-150">{error}</p>}
      </div>
    </>
  )
}

export default TextInput
