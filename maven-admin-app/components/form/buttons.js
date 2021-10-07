import React from 'react'

const Button = ({ buttonContent, action, buttonStyle, type, disabled }) => {
  let colorStyle = 'bg-indigo-600 hover:bg-indigo-700 text-white'
  switch (buttonStyle) {
    case 'blue':
      colorStyle = 'bg-indigo-600 hover:bg-indigo-700 text-white'
      break
    case 'white':
      colorStyle = 'bg-gray-white hover:bg-gray-50 text-gray-700'
      break
  }

  return (
    <button
      type={type}
      onClick={action}
      disabled={disabled}
      className={`ml-3 inline-flex justify-center py-2 px-4 border-1 border-transparent shadow-sm text-sm font-medium rounded-md ${colorStyle} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
    >
      {buttonContent}
    </button>
  )
}
export default Button
