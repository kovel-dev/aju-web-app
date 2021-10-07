import React from 'react'
import Button from '../form/button'

const LearnMore = ({ title, description, btnContent, ctaLink }) => {
  return (
    <div className="max-w-wrapper mx-auto px-5">
      <div className="flex md:flex-row flex-col items-center justify-between border-b border-t border-gray-75 py-10 sm:py-5 bg-white">
        <div className="md:w-7/12 w-full">
          <h3 className="text-xl text-blue-850 font-bold sm:mb-0 mb-4">
            {title}
          </h3>
          <p>{description}</p>
        </div>
        <a
          className={`md:ml-3 inline-flex justify-center py-2.5 px-4 border-1 border-transparent shadow-sm text-xl bg-blue-850 hover:opacity-80 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-850 min-w-btn items-center mt-6 md:mt-0 font-semibold`}
          href={ctaLink}
        >
          {btnContent}
        </a>
      </div>
    </div>
  )
}
export default LearnMore
