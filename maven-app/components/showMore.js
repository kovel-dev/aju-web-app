import { useState, useEffect } from 'react'

const ShowMore = ({ content }) => {
  const [expand, setExpand] = useState(false)

  const toggleExpand = () => {
    if (expand) {
      setExpand(false)
    } else {
      setExpand(true)
    }
  }

  return (
    <div className="max-w-wrapper mx-auto px-5">
      <div
        className={`hidden-text block ${!expand ? 'h-0 overflow-hidden' : ''}`}
      >
        {content.map((paragraph, index) => {
          return (
            <p
              className="text-center my-4 leading-6 sm:text-base text-sm"
              key={index}
            >
              {paragraph}
            </p>
          )
        })}
      </div>
      <button
        className={`w-full text-center flex items-center justify-center text-lg font-bold py-1 ${
          expand ? 'bg-gray-50 text-blue-850' : 'bg-blue-850 text-white'
        }`}
        onClick={toggleExpand}
      >
        Show {!expand ? 'More' : 'Less'}{' '}
        <img
          src={
            expand ? '/images/chevron-up.png' : '/images/chevron-down-white.png'
          }
          className="ml-4 h-3 w-auto"
        />
      </button>
    </div>
  )
}
export default ShowMore
