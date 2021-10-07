import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import moment from 'moment'

import { Heading3, Heading4, Text } from '@components/partials'
import { SocialShareButton } from 'components'
import { server } from 'lib/config/server'

const StepConfirm = (props) => {
  let router = useRouter()

  const [confirmationId, setConfirmationId] = useState('')

  useEffect(async () => {
    if (router.isReady) {
      let { orderId } = router.query
      setConfirmationId(orderId)
    }
  }, [])

  return (
    <div className="px-5 mx-auto mt-2 max-w-wrapper sm:mt-4">
      <Text
        text="Congratulations, your order is complete! We have emailed your ticket confirmation."
        className="text-center no-printme"
      />
      {props.confirmationInfo.items.map((product, productIndex) => (
        <div className={''} key={productIndex}>
          <div className={`px-4 py-6 mt-8 lg:px-12 lg:mt-12 bg-blue-850 `}>
            <div className="flex flex-col items-center justify-between lg:flex-row">
              <p className="max-w-2xl text-center text-white lg:text-lg lg:text-left">
                Share the details, and invite your friends to join you via
                social media!
              </p>
              <div className="flex items-center mt-2 lg:mt-0">
                <SocialShareButton
                  title={product.title}
                  url={`${server}/events-classes/program/${product.slug}`}
                  description={product.shortDescription}
                  variant="facebook"
                  className="mr-6"
                />
                <SocialShareButton
                  title={product.title}
                  url={`${server}/events-classes/program/${product.slug}`}
                  variant="twitter"
                  className="mr-6"
                />
              </div>
            </div>
          </div>
          <div className={`product-items`} key={productIndex}>
            <div className="px-4 py-6 bg-white product-item lg:px-12 shadow-2">
              <div className="flex items-center justify-between pb-5 lg:border-b-2 border-gray-75">
                <div>
                  <Text
                    text={`${
                      props.user.name
                    }, you’re attending ${product.title.trim()}.`}
                    className="mb-5"
                  />
                  <div className="items-start justify-center block lg:flex">
                    <div className="min-w-product max-w-product">
                      <img
                        src={product.imageUrl}
                        alt="Product image thumbnail"
                        className="object-cover"
                      />
                    </div>
                    <div className="mt-5 ml-0 lg:ml-7 lg:mt-0">
                      <Link
                        href={`${server}/events-classes/program/${product.slug}`}
                      >
                        <a target="_blank">
                          <Heading3
                            heading={product.title}
                            className="mb-5 uppercase"
                          />
                        </a>
                      </Link>
                      <Text
                        text={moment(product.startDt).format(
                          'dddd, MMMM DD, YYYY [at] hA'
                        )}
                        className="mb-3"
                      />
                      <Text text={product.address} className="mb-2" />
                      {product.sponsorBy.length > 0 && (
                        <Text
                          text={`Sponsored by: ${product.sponsorBy
                            .map((item, index) => {
                              return item.label
                            })
                            .join(', ')}`}
                          className="mb-2"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:pt-5">
                <div className="flex flex-col items-center justify-start lg:flex-row lg:justify-end">
                  <Heading3
                    heading={`Confirmation Number ${confirmationId}`}
                    className="uppercase"
                  />
                  <button
                    className="inline-block px-8 py-3 mt-4 text-lg font-bold text-white lg:ml-auto lg:mt-0 bg-blue-850 font-mont hover:opacity-80"
                    onClick={() => print(productIndex)}
                  >
                    Print Confirmation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="px-4 py-6 mt-5 bg-white lg:px-12 shadow-2 no-printme">
        <div className="flex flex-col items-center justify-center md:justify-between lg:flex-row">
          <Heading4
            heading="Support Maven today! Your donations will help us in our mission to bring Jewish wisdom to the world."
            className="max-w-xl font-mont lg:text-left sm:text-center"
          />
          <Link href="/donate">
            <a className="inline-block px-8 py-3 mt-6 text-lg font-bold text-white lg:ml-auto bg-blue-850 font-mont hover:opacity-80 lg:mt-0">
              Donate
            </a>
          </Link>
        </div>
      </div>

      <p className="px-4 mt-10 lg:text-lg text-gray-950 lg:px-12 no-printme">
        View your ticket information{' '}
        <Link href="/individual/purchase-history">
          <a className="font-bold underline text-blue-850">My Orders</a>
        </Link>{' '}
        continue browsing{' '}
        <Link href="/events-classes">
          <a className="font-bold underline text-blue-850">Events & Classes</a>
        </Link>
      </p>
    </div>
  )
}

export default StepConfirm
