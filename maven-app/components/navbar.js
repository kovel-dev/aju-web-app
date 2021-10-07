/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSession, signOut } from 'next-auth/client'
import Link from 'next/link'
import SearchBar from './search/searchBar'

const Navbar = () => {
  const [openSearch, setOpenSearch] = useState(false)
  const [userInput, setUserInput] = useState('')
  const [width, setWindowWidth] = useState(700)
  const [session, loading] = useSession()
  const router = useRouter()

  const toggleSearch = () => {
    if (openSearch) {
      setOpenSearch(false)
      setUserInput('')
    } else {
      setOpenSearch(true)
    }
  }

  const processSearchInput = () => {
    if (userInput.length > 0) {
      window.location.href = '/search-results?search=' + userInput
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      processSearchInput()
    }
  }

  const updateDimensions = () => {
    const width = window.innerWidth
    setWindowWidth(width)
  }

  useEffect(() => {
    updateDimensions()
    window.addEventListener('resize', updateDimensions)

    return () => {
      window.removeEventListener('resize', updateDimensions)
    }
  }, [])

  const navLinks = [
    {
      label: 'Events & Classes',
      link: '/events-classes',
    },
    {
      label: 'On Demand',
      link: '/on-demand',
    },
    {
      label: 'How It Works',
      link: '/how-it-works',
    },
    {
      label: 'About Us',
      link: '/about-us',
    },
    {
      label: 'Contact',
      link: '/contact',
    },
    {
      label: 'Help',
      link: '/faq',
    },
  ]

  const toggleMenu = () => {
    document.getElementById('mobile-toggle').classList.toggle('open')
    document.getElementById('mobile-menu').classList.toggle('open')
  }

  return (
    <div className="relative w-full no-printme">
      <div className="relative z-30 flex justify-between px-2 py-4 bg-white nav-shadow">
        <div className="flex">
          <button
            className="flex flex-col justify-around ml-4 mr-4 mobile-toggle w-7 sm:justify-evenly focus:outline-none xl:hidden"
            id="mobile-toggle"
            onClick={toggleMenu}
          >
            <span className="block h-0.5 border-blue-850 border-t-2 w-7"></span>
            <span className="block h-0.5 border-blue-850 border-t-2 w-7"></span>
            <span className="block h-0.5 border-blue-850 border-t-2 w-7"></span>
          </button>
          <div className="navbar-logo">
            <Link href="/">
              <a>
                <img
                  src="/images/maven_logo2.png"
                  alt="Maven logo"
                  className="w-auto ml-2 h-7 sm:h-10"
                />
              </a>
            </Link>
          </div>
        </div>
        {((!session && !loading) ||
          (session && session.user.role == 'student')) && (
          <Link href="/cart">
            <a className="w-auto mx-2 h-7 sm:h-10 hover:opacity-80 xl:hidden">
              <img
                src="/images/cart.png"
                alt="Shopping cart icon"
                className="w-auto h-7 sm:h-10"
              />
            </a>
          </Link>
        )}
        <div className="hidden navbar-main xl:flex">
          <div className="flex items-center navbar-link">
            {navLinks.map((navItem) => {
              return (
                <Link href={navItem.link} key={navItem.link}>
                  <a className="2xl:px-4 px-3 hover:underline">
                    {navItem.label}
                  </a>
                </Link>
              )
            })}
          </div>
          <div className="flex 2xl:ml-4 navbar-buttons">
            <a
              className="inline-flex items-center justify-center 2xl:px-4 px-3 py-2 mx-2 text-white bg-blue-450 hover:opacity-80"
              href="/donate"
            >
              Donate
            </a>
            {!session && !loading && (
              <Link href="/login">
                <button className="inline-flex items-center justify-center 2xl:px-4 px-3 py-2 mx-2 text-white bg-blue-850 hover:opacity-80 font-mont">
                  Log in
                </button>
              </Link>
            )}
            {session && (
              <button
                className="inline-flex items-center justify-center 2xl:px-4 px-3 py-2 mx-2 text-white bg-blue-850 hover:opacity-80 font-mont"
                onClick={() => {
                  if (session.user.role == 'partner') {
                    router.push('/organization/dashboard')
                  } else if (session.user.role == 'student') {
                    router.push('/individual/dashboard')
                  }
                }}
              >
                My Profile
              </button>
            )}
            {session && (
              <button
                className="inline-flex items-center justify-center 2xl:px-4 px-3 py-2 mx-2 text-white bg-blue-850 hover:opacity-80 font-mont"
                onClick={() =>
                  signOut({
                    callbackUrl: process.env.NEXT_PUBLIC_APP_URL,
                  })
                }
              >
                Log out
              </button>
            )}
            {((!session && !loading) ||
              (session && session.user.role == 'student')) && (
              <Link href="/cart">
                <a className="w-auto h-10 mx-2 hover:opacity-80">
                  <img
                    src="/images/shopping-cart.svg"
                    alt="Shopping cart icon"
                    className="w-auto h-10"
                  />
                </a>
              </Link>
            )}
            <button
              onClick={toggleSearch}
              className="inline-flex items-center justify-center 2xl:px-4 px-3 py-2 mx-2 text-white bg-blue-850 hover:opacity-80 font-mont"
            >
              Search
            </button>
          </div>
        </div>
      </div>
      {openSearch && (
        <div className="flex mx-auto max-w-wrapper">
          <input
            type="text"
            name="site-search"
            value={userInput}
            id="site-search"
            onChange={(e) => {
              const newUserInput = e.target.value
              setUserInput(newUserInput)
            }}
            placeholder="Search for events, classes, topics"
            // autoComplete={autoComplete}
            disabled={false}
            // The width options: "xs", "sm", "md", lg", "xl"
            className={`border-b border-t border-gray-80 font-mont block w-full sm:text-lg px-3 py-2 placeholder-black focus:outline-none bg-white`}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={processSearchInput}
            type="submit"
            className="inline-flex items-center justify-center px-4 py-2 text-white bg-blue-850 hover:opacity-80 font-mont"
          >
            Search
          </button>
        </div>
      )}
      <div
        className={`absolute top-0 z-20 h-screen ${
          session ? 'min-h-mobile-menu' : 'min-h-screen'
        } px-6 pt-20 bg-white w-80 md:w-96 sm:pt-24 mobile-menu nav-shadow xl:hidden`}
        id="mobile-menu"
      >
        <SearchBar
          placeholder="Search events, classes, topics"
          nav={true}
          updateUserInputProp={(newUserInput) => {
            setUserInput(newUserInput)
          }}
          submitSearchProp={() => processSearchInput()}
        />
        <div className="flex flex-col">
          {navLinks.map((navItem) => {
            return (
              <Link href={navItem.link} key={navItem.link}>
                <a className="px-6 py-5 text-sm sm:text-base">
                  {navItem.label}
                </a>
              </Link>
            )
          })}
          <div className="flex flex-wrap px-4 mt-1">
            <Link href="/donate">
              <a className="inline-flex items-center justify-center px-6 py-3 mx-1 text-sm text-white bg-blue-450 hover:opacity-80 sm:text-base">
                Donate
              </a>
            </Link>
            {!session && !loading && (
              <Link href="/login">
                <button className="inline-flex items-center justify-center px-6 py-3 mx-1 text-sm text-white font-mont bg-blue-850 hover:opacity-80 sm:text-base">
                  Log in
                </button>
              </Link>
            )}
            {session && (
              <button
                className="inline-flex items-center justify-center px-6 py-3 mx-1 text-sm text-white font-mont bg-blue-850 hover:opacity-80 sm:text-base"
                onClick={() => {
                  if (session.user.role == 'partner') {
                    router.push('/organization/dashboard')
                  } else if (session.user.role == 'student') {
                    router.push('/individual/dashboard')
                  }
                }}
              >
                My Profile
              </button>
            )}
          </div>
          {session && (
            <div className="px-4">
              <button
                className="mt-6 inline-flex items-center justify-center px-6 py-3 mx-1 text-sm text-white font-mont bg-blue-850 hover:opacity-80 sm:text-base"
                onClick={() =>
                  signOut({
                    callbackUrl: process.env.NEXT_PUBLIC_APP_URL,
                  })
                }
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
export default Navbar
