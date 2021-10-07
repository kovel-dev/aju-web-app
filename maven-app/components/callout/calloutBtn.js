import React from 'react'

const CalloutBtn = ({ mainContent, btnContent, ctaLink }) => {
  return (
    <div className="max-w-wrapper mx-auto px-5">
      <div className="flex md:flex-row flex-col items-center justify-between callout-shadow p-6 md:p-10 relative bottom-5 sm:bottom-20 bg-white">
        <h2 className="text-3xl text-blue-850 font-bold md:w-7/12 w-full md:text-left text-center">
          {mainContent}
        </h2>
        <a
          href={ctaLink}
          className={`uppercase ml-3 inline-flex justify-center py-5 px-4 border-1 border-transparent shadow-sm text-xl bg-blue-850 hover:opacity-80 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-850 min-w-btn items-center mt-6 md:mt-0 font-bold`}
        >
          {btnContent}
        </a>
      </div>
    </div>
  )
}
export default CalloutBtn
