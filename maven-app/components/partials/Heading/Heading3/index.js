import React from 'react'

export const Heading3 = ({ heading, className }) => {
  return (
    <div>
      <h3
        className={`font-bold text-blue-850 text-xl lg:text-2xl ${
          className ? className : ''
        }`}
      >
        {heading}
      </h3>
    </div>
  )
}
