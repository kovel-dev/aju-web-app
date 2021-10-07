/* eslint-disable */
import React from 'react'

const SelectInput = ({
  label,
  id,
  name,
  options,
  value,
  onChange,
  placeholder,
  width,
  error,
  blueLabel,
  disabled,
  otherOptions,
  otherError,
  otherOnChange,
  style,
  halfFull
}) => {
  return (
    <div className={`${halfFull ? 'md:max-w-1/2 lg:pr-3' : 'max-w-' + width} flex flex-col`}>
      {label && (
        <label
          htmlFor={id}
          className={`block font-mont pb-3 sm:text-lg ${
            blueLabel ? 'text-blue-850 font-bold' : ''
          }`}
        >
          {label}
        </label>
      )}
      <div className="mt-1 sm:mt-0 sm:col-span-2 relative" style={style}>
        <select
          id={id}
          className={`block w-full border-gray-300 font-mont focus:outline-none max-w-${width} border-gray-75 border rounded-sm pl-3 pr-12 py-2 sm:text-lg relative bg-transparent z-10`}
          disabled={disabled}
          name={name}
          value={value}
          onChange={onChange}
        >
          <option value="" disabled hidden>
            {placeholder}
          </option>
          {options.map((item) => (
            <option
              key={item.key}
              value={item.key}
              className={item.category ? 'font-bold' : ''}
            >
              {item.value}
            </option>
          ))}
        </select>
        <span className="bg-blue-850 text-white sm:h-9 sm:w-9 h-8 w-8 inline-flex items-center justify-center text-xl absolute ml-1 top-1.5 right-1 sm:right-1.5 rounded-sm">
          <img
            src="/images/chevron-down-white.png"
            alt="chevron down icon"
            className="w-3 h-auto"
          />
        </span>
      </div>
      {error && <p className="text-red-150 text-xs mt-2 px-3">{error}</p>}
      {otherOptions && (
        <div
          className={`mt-5 lg:mt-8 sm:col-span-2 relative md:max-w-${otherOptions.width}`}
        >
          <input
            type={otherOptions.type}
            name={otherOptions.name}
            value={otherOptions.value}
            id={otherOptions.id}
            onChange={otherOnChange}
            placeholder={otherOptions.placeholder}
            autoComplete={otherOptions.autoComplete}
            required={otherOptions.required}
            disabled={otherOptions.disabled}
            // The width options: "xs", "sm", "md", lg", "xl"
            className={`block w-full md:max-w-${otherOptions.width} sm:text-lg border-gray-75 border px-3 py-2 placeholder-black focus:outline-none rounded-sm`}
          />
          {otherError && (
            <span className="bg-red-150 text-white h-8 w-8 inline-flex items-center justify-center text-xl absolute ml-1 top-1.5 sm:top-2 right-1.5">
              !
            </span>
          )}
          {otherError && (
            <p className="text-red-150 text-xs mt-2 px-3">{otherError}</p>
          )}
        </div>
      )}
    </div>
  )
}

export default SelectInput
