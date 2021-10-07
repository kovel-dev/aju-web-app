import React from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const DateInput = ({
  label,
  id,
  name,
  onChange,
  value,
  minDate,
  maxDate,
  dateValue,
}) => {
  return (
    <div
      className={`flex w-full mr-0 sm:mr-4 lg:mr-10 text-sm flex-col font-sans consumer relative`}
    >
      {label && (
        <label
          htmlFor={id}
          className={`inline-block text-sm py-2 object-fillw-full`}
        >
          {label}
        </label>
      )}
      <DatePicker
        className={`w-full px-4 bg-transparent cursor-pointer border-gray-75 border rounded-sm pl-3 py-2 font-mont focus:outline-none placeholder-black sm:text-lg`}
        placeholderText="MM - DD - YYYY"
        dateFormat="MM - dd - yyyy"
        id={id}
        name={name}
        selected={dateValue}
        value={value}
        onChange={onChange}
        minDate={minDate}
        maxDate={maxDate}
        autoComplete="off"
      />
    </div>
  )
}

export default DateInput
