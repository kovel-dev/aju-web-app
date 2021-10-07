/* eslint-disable */
import { useState, useEffect } from 'react'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { CloudinaryContext, Image, Transformation } from 'cloudinary-react'
import { getPublicIdFromURL } from '../../lib/handlers/helper-handlers'
import CloudinaryImage from './cloudinary-image'

const CardContainer = ({ schema, noScroll }) => {
  const cloundName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  return (
    <div className="w-full my-10 no-printme">
      <div
        className={`max-w-wrapper mx-auto px-5 ${
          noScroll
            ? 'grid lg:gap-12 gap-8 lg:grid-cols-3 grid-cols-1 pb-4 lg:pb-0'
            : 'lg:grid lg:gap-12 lg:grid-cols-3 flex space-x-6 overflow-x-auto lg:space-x-0 lg:overflow-visible lg:pb-0 pb-6 lg:mb-0 -mb-6'
        }`}
      >
        {schema && schema.map((item, index) => {
          const cloudinaryPublicID = getPublicIdFromURL(item.img)
          const cardImageAltText = 'Thumbnail Image for ' + (item.title ? item.title : item.label)
          return (
            <Link href={item.link} key={index}>
              <a
                className={`card card-shadow bg-gray-100 flex flex-col justify-between ${
                  noScroll ? 'lg:max-w-full max-w-card mx-auto' : ''
                }`}
              >
                <div>
                  <div className="relative img-container">
                    {cloudinaryPublicID ? (
                      <CloudinaryImage
                      defaultAltText={cardImageAltText}
                      publicId={cloudinaryPublicID}
                      width="321"
                      height="181"
                    />
                    ) : (
                      <img
                        src={item.img}
                        alt={cardImageAltText}
                      />
                    )}

                    {item.expires && (
                      <div className="bg-yellow-500 absolute py-1.5 w-full bottom-0">
                        <p className="font-bold text-center uppercase text-blue-850">
                          Access Expires:
                        </p>
                        <p className="text-center uppercase text-blue-850">
                          {item.expires.date} / {item.expires.time}
                        </p>
                      </div>
                    )}
                  </div>
                  {item.title && item.description && (
                    <div className="bg-gray-100 block-main">
                      <div className="flex">
                        {item.day && item.month && (
                          <div>
                            <div className="bg-blue-850 p-2 pb-2.5 text-white uppercase relative flex flex-col items-center justify-center w-16">
                              <p className="text-xs">
                                {item.month.length > 5
                                  ? item.month.substring(0, 3)
                                  : item.month}
                              </p>
                              <p className="relative text-2xl tracking-wider bottom-1">
                                {item.day}
                              </p>
                              {item.free && (
                                <p className="bg-yellow-500 text-white uppercase absolute -bottom-3 text-xs font-semibold py-1 px-1.5">
                                  Free
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                        <h3
                          className={`uppercase font-bold text-blue-850 text-xl self-center overflow-wrap ${
                            item.month && item.day ? 'px-4' : 'pt-5 px-6'
                          }`}
                        >
                          {item.title}
                        </h3>
                      </div>
                      <p
                        className={`${
                          item.day && item.month ? 'p-6 pt-3' : 'pt-2 px-6'
                        } ${!item.label ? 'pb-12' : 'pb-6'}`}
                      >
                        {item.description}
                      </p>
                    </div>
                  )}
                </div>
                {item.label && (
                  <div className="flex items-center justify-between bg-white">
                    <h3 className="pl-3 font-bold leading-4 uppercase">
                      {item.label}
                    </h3>
                    <div className="flex items-center justify-center w-12 h-12 text-lg bg-blue-850">
                      <img
                        src="/images/chevron-down-white.png"
                        className="w-4 h-auto transform -rotate-90"
                      />
                    </div>
                  </div>
                )}
              </a>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
export default CardContainer
