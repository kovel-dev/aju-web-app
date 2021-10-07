import React, { useEffect, useState } from 'react'

const PageLoader = ({
  openPageLoader,
  pageLoaderTitleText = '',
  pageLoaderSubText = '',
}) => {
  const [isOpenPageLoader, setIsOpenPageLoader] = useState(false)

  useEffect(() => {
    if (isOpenPageLoader) {
      document.getElementById('delete-modal')?.classList.remove('hidden')
      document.getElementById('delete-overlay')?.classList.remove('hidden')
    } else {
      document.getElementById('delete-modal')?.classList.add('hidden')
      document.getElementById('delete-overlay')?.classList.add('hidden')
    }
  }, [isOpenPageLoader])

  useEffect(() => {
    if (openPageLoader) {
      setIsOpenPageLoader(true)
    } else {
      setIsOpenPageLoader(false)
    }
  }, [openPageLoader])

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
          <div className="relative block px-1 pb-8 text-center">
            <div className="flex items-center justify-center pt-3 pb-6">
              <img src="/images/loading.gif" alt="Loading icon" />
            </div>
            <h3 className="mb-4 text-xl font-bold sm:text-2xl text-blue-850">
              {pageLoaderTitleText}
            </h3>
            {pageLoaderSubText.length > 0 && <p>{pageLoaderSubText}</p>}
          </div>
        </div>
      </div>
    </>
  )
}

export default PageLoader
