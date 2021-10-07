/* eslint-disable */
import React from 'react'
import classNames from 'classnames'

const Button = ({
  buttonContent,
  action,
  buttonStyle,
  type,
  disabled,
  icon,
  subscribe,
  width,
  variant = 'default',
  className: wrapperStyle,
  suggestion,
}) => {
  let colorStyle = 'bg-blue-850 text-white text-xl'
  switch (buttonStyle) {
    case 'blue':
      colorStyle = 'bg-blue-850 text-white text-xl '
      break
    case 'light-blue':
      colorStyle = 'bg-blue-450 text-white text-xl '
      break
    case 'blue-outline':
      colorStyle = 'bg-white border-4 border-blue-850 text-blue-850 text-lg'
      break
    case 'gray-outline':
      colorStyle = 'bg-white border-4 border-gray-500 text-gray-500 text-lg'
      break
    case 'white':
      colorStyle = 'bg-gray-white text-gray-700 text-xl'
      break
  }

  const styles = (() => {
    switch (variant) {
      default:
      case 'default':
        return 'px-10'
      case 'fit':
        return 'px-3'
    }
  })()

  return (
    <button
      type={type}
      onClick={action}
      disabled={disabled}
      className={classNames(
        'inline-flex justify-center border-1 border-transparent font-semibold focus:outline-none hover:opacity-80 focus:opacity-80 items-center',
        colorStyle,
        subscribe
          ? 'py-4 sm:py-2.5 shadow-sm'
          : suggestion
          ? 'py-5 uppercase callout-shadow'
          : 'py-2.5 shadow-sm',
        width ? 'w-' + width : 'min-w-btn',
        wrapperStyle,
        styles
      )}
    >
      {icon && <img src={icon} alt="icon image" className="mr-2" />}
      {buttonContent}
    </button>
  )
}
export default Button
