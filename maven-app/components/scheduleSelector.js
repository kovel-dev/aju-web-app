import { useState } from 'react'
import SelectInput from '@components/form/selectInput'
import { Typography } from '.'
import { Button } from '.'
import DateInput from './form/dateInput'

const ScheduleSelector = ({
  schedToProp,
  schedFromProp,
  purchaseHistory,
  defaultFrom = '',
  defaultTo = '',
  buttonAction,
}) => {
  const [schedFrom, setSchedFrom] = useState(defaultFrom)
  const [schedTo, setSchedTo] = useState(defaultTo)

  return (
    <div className="flex flex-col items-center justify-between space-y-4 mb-14 lg:mb-20 lg:flex-row lg:space-y-0">
      <Typography
        color="text-blue-850"
        className={`text-lg font-bold flex-shrink-0 ${
          purchaseHistory ? 'lg:w-44' : ''
        }`}
      >
        {purchaseHistory ? 'View my purchase ' : 'View my schedule from'}
        {purchaseHistory && (
          <span className="whitespace-nowrap">history from</span>
        )}
      </Typography>
      <div className="w-full lg:w-3/12 sm:w-1/2 sm:px-4 px-0">
        <DateInput
          id="schedule-from"
          name="schedule_from"
          value={schedFrom ? schedFrom : ''}
          onChange={(newFrom) => {
            setSchedFrom(newFrom)
            schedFromProp(newFrom)
          }}
          dateValue={schedFrom}
          maxDate={schedTo}
        />
      </div>
      <Typography className="text-lg">to</Typography>
      <div className="w-full lg:w-3/12 sm:w-1/2 sm:px-4 px-0">
        <DateInput
          id="schedule-to"
          name="schedule_to"
          value={schedTo ? schedTo : ''}
          onChange={(newTo) => {
            setSchedTo(newTo)
            schedToProp(newTo)
          }}
          dateValue={schedTo}
          minDate={schedFrom}
        />
      </div>
      <div className="pt-2 lg:pt-0 flex-shrink-0">
        <Button
          type="button"
          buttonContent={
            purchaseHistory ? ' View Purchase History' : 'View Schedule'
          }
          action={() => {
            buttonAction()
          }}
        />
      </div>
    </div>
  )
}

export default ScheduleSelector
