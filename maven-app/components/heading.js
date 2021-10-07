import React from 'react'
import Link from 'next/link'

const Heading = ({ heading, breadcrumbs }) => {
  return (
    <div className="pt-2 sm:pt-4 pb-2.5 px-5 no-printme">
      <div className="items-center hidden breadcrumbs sm:flex">
        {breadcrumbs?.map((item, itemIndex) => {
          return (
            <div className="flex items-center" key={itemIndex}>
              <Link href={item.link}>
                <a>{item.label}</a>
              </Link>
              {breadcrumbs.length - 1 > itemIndex && (
                <div>
                  <img
                    src="/images/chevron-right.png"
                    className="w-1.5 h-auto mx-2"
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
      {heading && (
        <h1
          className={`max-w-wrapper mx-auto py-3.5 md:px-0 text-2xl sm:text-3xl lg:text-4xl text-blue-850 text-center font-bold mt-1 sm:mt-8`}
        >
          {heading}
        </h1>
      )}
    </div>
  )
}
export default Heading
