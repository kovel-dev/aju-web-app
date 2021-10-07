import React from 'react'

function heading(props) {
  const attr = props.attr
  return (
    <div
      className="pl-4 bg-gray-300 sm:py-3 sm:border-b sm:border-gray-200"
      key={attr.name}
    >
      <h3 className="text-lg leading-6 font-medium text-gray-900">
        {attr.title}
      </h3>
      <p className="mt-1 max-w-2xl text-sm text-gray-500">{attr.subTitle}</p>
    </div>
  )
}

export default heading
