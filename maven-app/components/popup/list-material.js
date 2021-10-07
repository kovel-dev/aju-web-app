import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@components/form'

const ListMaterialPopup = ({ open, closeProp, subText = '', items }) => {
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
        className="fixed inset-0 z-50 hidden w-screen h-screen transition-opacity bg-transparent"
        aria-hidden="true"
        id="delete-overlay"
      >
        <div className="absolute inset-0 z-10 bg-gray-500 opacity-75"></div>
        <div
          className="relative z-40 hidden p-2 mx-auto overflow-hidden text-left bg-white border-2 rounded-sm shadow-xl modal max-w-success sm:top-1/4 top-1/12 top-14"
          id="delete-modal"
        >
          <div className="flex justify-end mb-1 text-2xl font-bold title-bar">
            <button
              onClick={() => {
                setIsOpen(false)
                closeProp(false)
              }}
              className="px-3 py-2 text-sm text-white rounded-sm focus:outline-none bg-blue-850"
            >
              &#10005;
            </button>
          </div>
          <div className="relative block px-1 pb-8 text-center">
            <h3 className="mb-4 text-xl font-bold sm:text-2xl text-blue-850">
              Marketing Materials
            </h3>
            <div className="text-center">
              {items.map((item, index) => {
                return (
                  <Link href={item[0].file} key={index}>
                    <a target="_blank">
                      <Button
                        buttonStyle="blue-outline"
                        className="font-bold mt-5 mb-5 w-full"
                        type="button"
                        buttonContent={`Open ${item[0].title || 'Material'}`}
                      />
                    </a>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ListMaterialPopup
