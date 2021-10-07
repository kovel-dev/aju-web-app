import { useState, useEffect } from 'react'

const Pagination = ({ pages, activePage, updatePageProp }) => {
  return (
    <div className="max-w-wrapper mx-auto px-5 flex items-center justify-center my-12 space-x-4">
      {pages.map((item, index) => {
        return (
          <button
            className={`${
              activePage == item
                ? 'text-white bg-blue-850'
                : 'text-blue-850 bg-gray-50'
            } flex px-4 py-2 justify-center items-center h-12 w-12`}
            key={index}
            onClick={() => {
              updatePageProp(item)
            }}
          >
            <p className="text-xl font-bold">{item}</p>
          </button>
        )
      })}
    </div>
  )
}
export default Pagination
