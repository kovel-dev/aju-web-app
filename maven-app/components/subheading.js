import React from 'react'

const Subheading = ({ content, secondRow, subContent, tags }) => {
  return (
    <div
      className={`flex-col items-center justify-center block px-5 my-10 md:flex sm:my-12 no-printme`}
    >
      <h2
        className={`py-3.5 md:px-0 text-2xl lg:text-3xl text-blue-850 text-center border-t-2 border-b-2 border-gray-100 font-bold no-printme ${
          tags ? 'max-w-screen-sm' : ''
        }`}
      >
        {content}
        {secondRow && <span className="block">{secondRow}</span>}
      </h2>
      {subContent && (
        <h4 className="mt-4 text-xl font-bold text-center text-blue-850 lg:text-2xl">
          {subContent}
        </h4>
      )}
    </div>
  )
}
export default Subheading
