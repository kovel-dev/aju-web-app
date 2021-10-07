import React from 'react'
import Link from 'next/link'

const Sponsorship = ({ tiers }) => {
  return (
    <div className="py-4 px-5 sm:px-0">
      <h3 className="text-xl font-bold text-blue-850 pt-8 pb-3 sm:py-5 border-gray-400 border-b">
        Sponsorship Opportunities
      </h3>
      {tiers.map((tier, index) => {
        return (
          <div
            className="border-b border-gray-400 flex py-5 justify-between sm:items-center sm:flex-row flex-col"
            key={index}
          >
            <p className="max-w-card">{tier.description}</p>
            <h2 className="lg:text-3xl text-2xl font-bold text-blue-850 sm:ml-8 mt-4 sm:mt-0">
              ${tier.price}
            </h2>
          </div>
        )
      })}
    </div>
  )
}
export default Sponsorship
