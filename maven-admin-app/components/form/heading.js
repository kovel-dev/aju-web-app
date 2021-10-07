import React from 'react'

const heading = ({ heading, description }) => {
  return (
    <div className="pt-8 sm:pt-10">
      <h3 className="text-lg leading-6 font-medium text-gray-900">{heading}</h3>
      {description && (
        <p className="mt-1 max-w-2xl text-sm text-gray-500">{description}</p>
      )}
    </div>
  )
}

export default heading
