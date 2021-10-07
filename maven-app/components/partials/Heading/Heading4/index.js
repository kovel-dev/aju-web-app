import React from 'react'

export const Heading4 = ({ heading, className }) => {
  return (
    <div>
      <h4
        className={`font-bold text-blue-850 text-xl ${
          className ? className : ''
        }`}
      >
        {heading}
      </h4>
    </div>
  )
}
