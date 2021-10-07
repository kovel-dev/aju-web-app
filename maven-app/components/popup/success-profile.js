import React, { useEffect, useState } from 'react'

const SuccessProfilePopup = ({ open, closeProp }) => {
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
          className="modal mx-auto bg-white rounded-sm p-2 text-left overflow-hidden border-2 max-w-success z-40 shadow-xl hidden relative sm:top-1/4 top-1/12 top-14"
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
          <div className="block relative text-center pb-8 px-1">
            <div className="flex items-center justify-center pb-6 pt-3">
              <img src="/images/sent.png" alt="Mail icon" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-blue-850 mb-4">
              Your profile has successfully updated!
            </h3>
          </div>
        </div>
      </div>
    </>
  )
}

export default SuccessProfilePopup
