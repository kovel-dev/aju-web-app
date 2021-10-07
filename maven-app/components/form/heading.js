/* eslint-disable */
import React from 'react'

const heading = ({ heading, description, suggestion, register }) => {
  return (
    <div className={`${suggestion ? 'lg:py-6' : ''}`}>
      <h3
        className={`${
          description && !register ? 'sm:text-2xl text-center' : ''
        } ${
          register ? 'sm:text-xl text-base' : 'text-xl'
        } font-bold text-blue-850 ${suggestion ? 'lg:text-center' : ''}`}
      >
        {heading}
      </h3>
      {description && (
        <p
          className={`max-w-2xl text-sm mt-1 ${
            !register ? 'text-center sm:mt-3 sm:text-lg' : 'sm:text-base'
          }`}
        >
          {description}
        </p>
      )}
    </div>
  )
}

export default heading
