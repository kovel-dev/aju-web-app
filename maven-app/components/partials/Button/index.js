import React from 'react'

export const Button = ({ button, className, fontSize, action }) => {
  return (
    <button
      onClick={action}
      className={`text-white text-center block font-bold px-3 py-3 ${
        fontSize ? 'text-' + fontSize : 'text-xl'
      } ${className ? className : ''} hover:opacity-80`}
    >
      {button}
    </button>
  )
}
