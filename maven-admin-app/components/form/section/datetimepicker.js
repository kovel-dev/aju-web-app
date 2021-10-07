import 'react-datepicker/dist/react-datepicker.css'
import React, { useState, useEffect } from 'react'
import DateTimePicker from 'react-datepicker'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'

function DatePicker(props) {
  const [value, setValue] = useState('')
  const [displayComponent, setDisplayComponent] = useState(true)
  const [defaultEndDate, setDefaultEndDate] = useState(false)

  useEffect(() => {
    const fieldValues = { ...props.fieldValues }
    if (props.conditionField) {
      let comp = props.conditionField
      if (fieldValues[comp] == props.conditionFalseValue) {
        setDisplayComponent(false)
      } else {
        setDisplayComponent(true)
      }
    }

    if (
      fieldValues.type === 'on-demand' &&
      props.name === 'registrationEndDt' &&
      moment(new Date(value)).format('yyyy-MM-DD') ==
        moment(new Date()).format('yyyy-MM-DD')
    ) {
      setDefaultEndDate(true)
      fieldValues['registrationEndDt'] = new Date('2050-12-01')
      fieldValues['millisecondRegistrationEndDt'] = new Date('2050-12-01')
    } else {
      setDefaultEndDate(false)
    }

    if (value) {
      setValue(value)
    } else {
      setValue(props.value)
    }
  }, [props])

  return (
    <>
      {displayComponent && (
        <div
          className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start py-3 sm:border-b sm:border-gray-200"
          aria-labelledby={`fm-select-${props.name}`}
          key={props.name}
        >
          <label
            htmlFor={props.id}
            className="block text-lg mb-2 sm:text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
          >
            {props.label}
            {props.isRequired ? '*' : ''}
          </label>
          <div className="mt-1 sm:mt-0 sm:col-span-2">
            <DateTimePicker
              id={props.id}
              name={props.name}
              className={`max-w-lg block focus:ring-primary focus:border-primary w-full shadow-sm sm:max-w-xs sm:text-sm border-gray-300 rounded-md ${
                props.invalid
                  ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500'
                  : ''
              }`}
              selected={
                defaultEndDate
                  ? new Date('2050-12-01')
                  : value
                  ? new Date(value)
                  : null
              }
              value={
                defaultEndDate
                  ? moment(new Date('2050-12-01')).format('yyyy-MM-DD hh:mm A')
                  : moment(new Date(value)).format('yyyy-MM-DD hh:mm A')
              }
              showTimeSelect
              timeIntervals={15}
              dateFormat="yyyy-MM-DD hh:mm A"
              onChange={(value) => {
                const newTagState = { ...props.fieldValues }
                newTagState[props.id] = moment(value.toUTCString()).format(
                  'yyyy-MM-DD HH:mm:ss'
                )

                props.fieldValuesHandler(newTagState)

                setValue(
                  moment(value.toUTCString()).format('yyyy-MM-DD HH:mm:ss')
                )
              }}
            />
            {props.invalid && (
              <p className="mt-2 text-sm text-red-600" id="email-error">
                {props.errMsg}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default DatePicker
