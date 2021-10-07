import React from 'react'
import Link from 'next/link'

function ErrorPage() {
  return (
    <div className="bg-white min-h-screen px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="max-w-max mx-auto">
        <div className="flex items-center justify-center h-16 sm:h-20 w-auto mb-20">
          <Link href="/">
            <a>
              <img
                src="/images/maven_logo2.png"
                className="h-16 sm:h-20 w-auto"
              />
            </a>
          </Link>
        </div>
        <main className="sm:flex">
          <div className="sm:ml-6 text-center font-mont">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                We are sorry, this page does not exist.
              </h1>
              <p className="mt-1 text-lg text-gray-700">
                Please navigate back to the{' '}
                <Link href="/">
                  <a className="hover:underline">homepage!</a>
                </Link>
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default ErrorPage
