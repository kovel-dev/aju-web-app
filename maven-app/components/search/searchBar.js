/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

const SearchBar = ({
  placeholder,
  updateUserInputProp,
  nav,
  variant = 'default',
  submitSearchProp,
  defaultValue = '',
  page
}) => {
  const [userInput, setUserInput] = useState(defaultValue)
  const [width, setWindowWidth] = useState(0)

  useEffect(() => {
    updateUserInputProp(userInput)
  }, [userInput])

  const updateDimensions = () => {
    const width = window.innerWidth
    setWindowWidth(width)
  }

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () =>
      window.removeEventListener('resize', updateDimensions);
  }, [])

  return (
    <form className="flex border sm:mt-0 mt-1.5 items-center" onSubmit={submitSearchProp}>
      <input
        type="text"
        name="site-search"
        value={userInput}
        id={placeholder.toLowerCase().split(' ').join('-')}
        onChange={(e) => {
          const newUserInput = e.target.value
          setUserInput(newUserInput)
        }}
        placeholder={width < 600 && placeholder.includes("What topics and") ? "Topics and Subjects" : placeholder}
        autoComplete="search-item"
        disabled={false}
        // The width options: "xs", "sm", "md", lg", "xl"
        className={`block w-full focus:ring-blue-700 focus:border-blue-700 px-3 ${
          variant === 'default' ? 'py-2' : 'py-4'
        } placeholder-black focus:outline-none bg-white ${
          nav ? 'sm:text-base text-sm' : 'sm:text-lg'
        }`}
      />
      <button
        onClick={submitSearchProp}
        type="submit"
        className={`hover:opacity-80 ${nav ? 'w-12 h-10' : 'w-9 h-9 mr-1'} ${
          variant === 'default'
            ? 'bg-blue-850 text-white'
            : 'bg-transparent text-gray-80'
        } font-mont flex items-center justify-center`}
      >
        <FontAwesomeIcon
          icon={faSearch}
          className={`${
            nav || variant === 'outline' ? '' : 'transform rotate-90'
          } ${variant === 'outline' ? 'text-gray-500' : ''} w-4 h-auto`}
        />
      </button>
    </form>
  )
}

export default SearchBar
