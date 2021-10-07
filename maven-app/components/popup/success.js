/* eslint-disable */
import React, { useEffect, useState } from 'react'

const Success = ({
  open,
  closeProp,
  request,
  check,
  icon,
  title,
  description,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.getElementById('delete-modal')?.classList.remove('hidden')
      document.getElementById('delete-overlay')?.classList.remove('hidden')
    } else {
      document.getElementById('delete-modal')?.classList.add('hidden')
      document.getElementById('delete-overlay')?.classList.add('hidden')
    }
  }, [isOpen])

  useEffect(() => {
    if (open) {
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  }, [open])

  return (
    <>
      {/* overlay */}
      <div
        className="fixed inset-0 transition-opacity z-50 h-screen w-screen bg-transparent hidden"
        aria-hidden="true"
        id="delete-overlay"
      >
        <div className="absolute inset-0 bg-gray-500 opacity-75 z-10"></div>
        <div
          className={`modal mx-auto bg-white rounded-sm p-2 text-left overflow-hidden border-2 z-40 shadow-xl hidden relative ${
            check ? 'max-w-form sm:top-1/12' : 'max-w-success sm:top-1/4'
          } top-14`}
          id="delete-modal"
        >
          <div className="title-bar flex text-2xl font-bold mb-1 justify-end">
            <button
              onClick={() => {
                setIsOpen(false)
                closeProp(false)
              }}
              className="focus:outline-none bg-blue-850 rounded-sm text-white text-sm px-3 py-2"
            >
              &#10005;
            </button>
          </div>
          <div
            className={`block relative text-center px-1 ${
              check ? 'lg:pt-16 lg:pb-24 pt-4 pb-12' : 'pb-8'
            }`}
          >
            <div className="flex items-center justify-center pb-6 pt-3">
              <img
                src={icon ? icon : '/images/sent.png'}
                alt="Mail icon"
                className={check ? 'lg:w-36 w-28 h-auto lg:mb-4' : ''}
              />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-blue-850 mb-4">
              {request
                ? 'Your request has been submitted.'
                : title
                ? title
                : 'Thank you for your message'}
            </h3>
            <p>{description ? description : "We'll get in touch soon."}</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Success
