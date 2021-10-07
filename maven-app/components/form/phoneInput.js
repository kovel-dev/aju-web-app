import React from 'react'
import NumberFormat from 'react-number-format'

const PhoneInput = ({
  label,
  id,
  name,
  value,
  onChange,
  placeholder,
  required,
  disabled,
  autoComplete,
  width,
  error,
}) => {
  return (
    <>
      {/* <label htmlFor={id} className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
        {label}
      </label> */}
      <div className={`mt-1 sm:mt-0 sm:col-span-2 md:max-w-${width} relative`}>
        <NumberFormat
          format="(###) ### ####"
          mask=""
          id={id}
          className={`block w-full md:max-w-${width} sm:text-lg border-gray-75 border px-3 py-2 placeholder-black focus:outline-none rounded-sm`}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          type="tel"
        />
        {error && (
          <span className="bg-red-150 text-white h-8 w-8 inline-flex items-center justify-center text-xl absolute ml-1 top-1.5 sm:top-2 right-1.5">
            !
          </span>
        )}
        {error && <p className="text-red-150 text-xs mt-2 px-3">{error}</p>}
      </div>
    </>
  )
}

export default PhoneInput
