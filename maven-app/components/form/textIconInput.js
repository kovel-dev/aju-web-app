import React from 'react'

const TextIconInput = ({
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
  icon,
  iconWidth,
  className,
  error,
  maxlength = 255,
}) => {
  return (
    <>
      <div
        className={`mt-1 sm:mt-0 sm:col-span-2 lg:w-${width} ${
          className ? className : ''
        }`}
      >
        <div
          className={`flex items-center w-full md:max-w-${width} md:text-lg border-gray-75 border-2 px-3 py-3 rounded-sm`}
        >
          <img src={`/images/${icon}.png`} width={iconWidth} />
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
            className={`w-${width} placeholder-black focus:outline-none ml-3`}
            maxLength={maxlength}
            // The width options: "xs", "sm", "md", lg", "xl"
          />
          {error && (
            <span className="bg-red-150 text-white h-8 w-8 inline-flex items-center justify-center text-lg absolute ml-1 top-1.5 sm:top-2 right-1.5">
              !
            </span>
          )}
          {error && <p className="text-red-150 text-xs mt-2 px-3">{error}</p>}
        </div>
      </div>
    </>
  )
}

export default TextIconInput
