import React from 'react'

export const Text = ({ text, className }) => {
  return (
    <p
      className={`font-normal text-gray-950 text-base lg:text-lg ${
        className ? className : ''
      }`}
    >
      {text}
    </p>
  )
}
