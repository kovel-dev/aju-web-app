import React, { useState } from 'react'
import { useAsyncDebounce } from 'react-table'

/*
This Component is used in react-table for Global Searching.
Its using debouncing with a 2 second delay so when there are 1000's of rows,
it doesn't feel laggy to the user.
*/

function GlobalFilter({ filter, setFilter }) {
  const [value, setValue] = useState(filter)
  const [isTyping, setIsTyping] = useState(false)

  const onChange = useAsyncDebounce((value) => {
    setFilter(value || undefined)
    setIsTyping(false)
  }, 1000)

  return (
    <div>
      <div className="mb-5">
        <input
          value={value || ''}
          onChange={(e) => {
            setValue(e.target.value)
            onChange(e.target.value)
          }}
          onKeyDown={(e) => {
            setIsTyping(true)
          }}
          className="block w-1/3 sm:text-md p-1.5 px-2.5 border-primary border-2 rounded-md"
          placeholder="Search"
        />
        {isTyping && <span>Searching...</span>}
      </div>
    </div>
  )
}

export default GlobalFilter
