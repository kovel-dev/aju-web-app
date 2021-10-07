import React from 'react'

const CalloutBlue = ({ mainContent, description }) => {
  return (
    <div className="w-full my-12 bg-blue-850 text-white py-12 md:py-20 lg:py-24 md:px-0 px-12">
      <div className="max-w-wrapper mx-auto text-center flex flex-col items-center justify-center">
        <h2 className="py-3.5 text-2xl lg:text-3xl text-white border-t md:border-t-2 border-b md:border-b-2 border-white-100 font-bold">
          {mainContent}
        </h2>
        <p className="mt-4 text-base lg:text-xl">{description}</p>
      </div>
    </div>
  )
}
export default CalloutBlue
