import React from 'react'

function Heading(props) {
  return (
    <div
      className="pl-4 bg-gray-300 sm:py-3 sm:border-b sm:border-gray-200"
      aria-labelledby={`fm-heading-${props.title}`}
      key={props.title}
    >
      <h3 className="text-lg leading-6 font-medium text-gray-900">
        {props.title}
      </h3>
      <p className="mt-1 max-w-2xl text-sm text-gray-500">{props.subHeading}</p>
    </div>
  )
}

export default Heading
