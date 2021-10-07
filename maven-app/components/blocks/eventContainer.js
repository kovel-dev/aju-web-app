/* eslint-disable */
import React, { useState, useEffect } from 'react'
import {
  Heading3,
  Heading4,
  Video,
  Icon,
  Text,
  Button,
  Richtext,
} from '../partials'
import { useRouter } from 'next/router'
import { getErrorMessage, hasError } from 'lib/validations/validations'
import PartnerForm from '@components/form/partnerForm'
import Loader from '@components/loader'
import moment from 'moment'
import Cart from 'lib/models/cart'
import Success from '@components/popup/success'

export default function EventContainer({ eventData, purchased, session }) {
  const [expand, setExpand] = useState(false)
  const [partnerForm, setPartnerForm] = useState(false)
  const [buttons, setButtons] = useState([])
  const [addBuy, setAddBuy] = useState(false)
  const [addLogin, setLogin] = useState(false)
  const [classFull, setClassFull] = useState(false)
  const [linkVisible, setLinkVisible] = useState(false)
  const [minutes, setMinutes] = useState()
  const router = useRouter()

  // variable to toggle loading gif
  const [isLoading, setIsLoading] = useState(false)
  // variable to toggle error message
  const [errors, setErrors] = useState({})
  // variable to toggle success message
  const [openSuccess, setOpenSuccess] = useState(false)
  const [partnerBuyType, setPartnerBuyType] = useState('')
  const price = eventData.price > 0 ? '$'+eventData.price : "Free"

  let cart = new Cart({})

  const toggleExpand = () => {
    setExpand(!expand)
  }

  useEffect(() => {
    setInterval(() => {
      if (eventData.type !== 'on-demand') {
        const todayDate = moment.utc(new Date()).valueOf()
        const currentTime = moment(new Date())
        const end = moment(eventData.startDateTime)
        const duration = moment.duration(end.diff(currentTime))
        const mins = duration.asMinutes()
        const fiveMinutesAgo = Math.floor(mins)
        setMinutes(fiveMinutesAgo)
        if (
          fiveMinutesAgo <= 5 &&
          todayDate >= eventData.millisecondStartDt &&
          todayDate < eventData.millisecondEndDt &&
          eventData.entitlement
        ) {
          setLinkVisible(true)
        }
      } else {
        const currentTime = moment(new Date())
        const purchaseDate = moment(eventData.purchaseDate)
        const duration = moment.duration(currentTime.diff(purchaseDate))
        const hour = duration.asHours()
        if (hour < 48.0) {
          setLinkVisible(true)
        }
      }
    }, 1000 * 60)
  }, [minutes])

  useEffect(() => {
    const todayDate = moment.utc(new Date()).valueOf()
    const currentTime = moment(new Date())
    const end = moment(eventData.startDateTime)
    const duration = moment.duration(end.diff(currentTime))
    const mins = duration.asMinutes()
    const fiveMinutesAgo = Math.floor(mins)
    const dateDiff = eventData.millisecondRegistrationStartDt - todayDate

    if (session) {
      if (eventData.type !== 'on-demand') {
        if (eventData.organization) {
          if (dateDiff > 0) {
            const buttons = [
              'Become a Sponsor',
              'Buy all Seats',
              'Reserve Seats',
              'Marketing Materials',
            ]
            setButtons(buttons)
          } else if (
            todayDate >= eventData.millisecondRegistrationStartDt &&
            todayDate <= eventData.millisecondRegistrationEndDt
          ) {
            const buttons = [
              'Add to Cart',
              'Register Now',
              'Marketing Materials',
            ]
            setButtons(buttons)
            setAddBuy(true)
          } else if (
            fiveMinutesAgo <= 5 &&
            todayDate >= eventData.millisecondStartDt &&
            todayDate < eventData.millisecondEndDt &&
            eventData.entitlement
          ) {
            const buttons = ['Marketing Materials']
            setButtons(buttons)
            setLinkVisible(true)
          } else {
            const buttons = ['Marketing Materials']
            setButtons(buttons)
          }
        } else {
          if (
            todayDate >= eventData.millisecondRegistrationStartDt &&
            todayDate <= eventData.millisecondRegistrationEndDt &&
            !eventData.class_full
          ) {
            const buttons = ['Add to Cart', 'Register Now']
            setButtons(buttons)
            setAddBuy(true)
          }
          if (
            eventData.class_full &&
            todayDate >= eventData.millisecondRegistrationStartDt &&
            todayDate < eventData.millisecondRegistrationEndDt
          ) {
            const buttons = ['Join Waitlist']
            setButtons(buttons)
            setClassFull(true)
          }
          if (
            fiveMinutesAgo <= 5 &&
            todayDate >= eventData.millisecondStartDt &&
            todayDate < eventData.millisecondEndDt &&
            eventData.entitlement
          ) {
            setLinkVisible(true)
          }
        }
      } else {
        const currentTime = moment(new Date())
        const purchaseDate = moment(eventData.purchaseDate)
        const duration = moment.duration(currentTime.diff(purchaseDate))
        const hour = duration.asHours()
        if (hour < 48.0) {
          setLinkVisible(true)
        }
      }
    } else {
      const buttons = ['Login', 'Register Now']
      setButtons(buttons)
      setLogin(true)
    }
  }, [])

  const addToCart = async (slug, redirect = false) => {
    setIsLoading(true)
    setErrors({})

    try {
      await cart.addToCart(slug).then((result) => {
        if (redirect) {
          router.push('/cart')
        } else {
          setOpenSuccess(true)
          setIsLoading(false)
        }
      })
    } catch (error) {
      setErrors(error)
      setIsLoading(false)
    }
  }

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }  

  return (
    <>
      {hasError(errors, 'general') && (
        <div className="justify-center mx-auto max-w-wrapper">
          <p className="text-center text-red-600">
            {getErrorMessage(errors, 'general')}
          </p>
        </div>
      )}
      <div className="px-5 mx-auto mt-10 mb-20 max-w-wrapper lg:my-14">
        <div className="flex flex-col flex-wrap items-start -mx-4 text-primary">
          <div
            className={`w-full px-4 ${
              !eventData.organization ? 'lg:flex' : ''
            }`}
          >
            <div
              className={
                eventData.organization || purchased
                  ? 'lg:mb-7'
                  : 'lg:min-w-video lg:w-video xl:min-w-videoxl'
              }
            >
              <Heading3
                heading={eventData.name}
                className="mb-3 uppercase lg:mb-5"
              />
              <Text
                text={eventData.shortDescription}
                className="mb-2 text-left lg:mb-6"
              />
              <Heading4
                heading={
                  purchased
                    ? 'Access expires on: ' + eventData.expires
                    : eventData.date_posted
                }
                className="mb-3"
              />
            </div>
            {!purchased && (
              <div
                className={`lg:flex hidden lg:space-x-7 ${
                  eventData.organization ? 'mt-12 mb-16' : 'lg:pl-12 w-full'
                }`}
              >
                {classFull && !eventData.organization && (
                  <div className="w-full max-w-btn">
                    <Button
                      button="Join Waitlist"
                      className="w-full bg-blue-850 max-w-btn hover:opacity-80 focus:opacity-80"
                      fontSize="lg"
                    />
                  </div>
                )}
                {addBuy && (
                  <>
                    {!isLoading && (
                      <>
                        <div className="w-full max-w-btn">
                          <Button
                            button="Add to Cart"
                            className={`w-full mx-auto bg-blue-850 max-w-btn hover:opacity-80 focus:opacity-80`}
                            fontSize="lg"
                            action={() => addToCart(eventData.slug)}
                          />
                        </div>
                        <div className="w-full">
                          <Button
                            button="Register"
                            className={`w-full mx-auto ml-auto bg-blue-450 max-w-btn hover:opacity-80 focus:opacity-80`}
                            fontSize="lg"
                            action={() => addToCart(eventData.slug, true)}
                          />
                        </div>
                      </>
                    )}
                    {isLoading && <Loader message="Processing..." />}
                  </>
                )}
                {eventData.organization && buttons.length === 4 && (
                  <>
                    <Button
                      button="Become a Sponsor"
                      className={`w-full bg-blue-850 max-w-btn hover:opacity-80 focus:opacity-80`}
                      fontSize="lg"
                      action={() => {
                        router.push('/donate')
                      }}
                    />
                    <Button
                      button="Buy all Seats"
                      className={`w-full bg-blue-850 max-w-btn hover:opacity-80 focus:opacity-80`}
                      fontSize="lg"
                      action={() => {
                        setPartnerForm(true)
                        setPartnerBuyType('buy-class-event')
                        window.scrollTo(0, 30)
                      }}
                    />
                    <Button
                      button="Reserve Seats"
                      className={`w-full bg-blue-850 max-w-btn hover:opacity-80 focus:opacity-80`}
                      fontSize="lg"
                      action={() => {
                        setPartnerForm(true)
                        setPartnerBuyType('reserve-seats')
                        window.scrollTo(0, 30)
                      }}
                    />
                  </>
                )}
                {eventData.organization && (
                  <>
                    <Button
                      button="Marketing Materials"
                      className={`w-full mt-3 ml-auto bg-blue-850 lg:mt-0${buttons.length < 2 ? ' lg:ml-0' : ' lg:ml-10'} max-w-btn opacity-70`}
                      fontSize="lg"
                    />
                  </>
                )}
                {addLogin && (
                  <>
                    {!isLoading && (
                      <>
                        <div className="w-full max-w-btn">
                          <Button
                            button="Log in to register"
                            className={`w-full mx-auto bg-blue-850 max-w-btn hover:opacity-80 focus:opacity-80`}
                            fontSize="lg"
                            action={() => router.push("/login")}
                          />
                        </div>
                      </>
                    )}
                    {isLoading && <Loader message="Processing..." />}
                  </>
                )}
              </div>
            )}
          </div>
          <div className="flex flex-col w-full mt-4 lg:mt-0 lg:flex-row lg:px-4">
            <Video
              className={`w-full h-auto ${
                !purchased
                  ? 'lg:max-w-4xl lg:min-w-video lg:w-video xl:min-w-videoxl'
                  : ''
              }`}
              src={eventData.imageUrl}
              entitlement={linkVisible}
              type={eventData.type}
            />
            {!purchased && (
              <>
                <div className="flex flex-col items-center justify-start space-x-0 space-y-5 lg:space-x-6 lg:hidden my-9">
                  {classFull && !eventData.organization && (
                    <Button
                      button="Join Waitlist"
                      className="w-full bg-blue-850 max-w-btn hover:opacity-80 focus:opacity-80"
                      fontSize="lg"
                    />
                  )}
                  {addBuy && (
                    <>
                      {!isLoading && (
                        <>
                          <Button
                            button="Add to Cart"
                            className="w-full mx-auto bg-blue-850 max-w-btn hover:opacity-80 focus:opacity-80"
                            fontSize="lg"
                            action={() => addToCart(eventData.slug + 1)}
                          />
                          <Button
                            button="Register Now"
                            className="w-full mx-auto mt-3 ml-auto bg-blue-850 lg:mt-0 lg:ml-10 max-w-btn opacity-70"
                            fontSize="lg"
                            action={() => addToCart(eventData.slug, true)}
                          />
                        </>
                      )}
                      {isLoading && <Loader message="Processing..." />}
                    </>
                  )}
                  {eventData.organization && buttons.length === 4 && (
                    <>
                      <Button
                        button="Become a Sponsor"
                        className="w-full bg-blue-850 max-w-btn hover:opacity-80 focus:opacity-80"
                        fontSize="lg"
                        action={() => {
                          router.push('/donate')
                        }}
                      />
                      <Button
                        button="Buy all Seats"
                        className="w-full bg-blue-850 max-w-btn hover:opacity-80 focus:opacity-80"
                        fontSize="lg"
                        action={() => {
                          setPartnerForm(true)
                          setPartnerBuyType('buy-class-event')
                          window.scrollTo(0, 30)
                        }}
                      />
                      <Button
                        button="Reserve Seats"
                        className="w-full bg-blue-850 max-w-btn hover:opacity-80 focus:opacity-80"
                        fontSize="lg"
                        action={() => {
                          setPartnerForm(true)
                          setPartnerBuyType('reserve-seats')
                          window.scrollTo(0, 30)
                        }}
                      />
                    </>
                  )}
                  {eventData.organization && (
                    <>
                      <Button
                        button="Marketing Materials"
                        className="w-full ml-auto bg-blue-850 lg:mt-0 mr-auto max-w-btn opacity-70"
                        fontSize="lg"
                      />
                    </>
                  )}
                  {addLogin && (
                    <>
                      {!isLoading && (
                        <>
                          <div className="w-full max-w-btn">
                            <Button
                              button="Log in to register"
                              className={`w-full mx-auto bg-blue-850 max-w-btn hover:opacity-80 focus:opacity-80`}
                              fontSize="lg"
                              action={() => router.push("/login")}
                            />
                          </div>
                        </>
                      )}
                      {isLoading && <Loader message="Processing..." />}
                    </>
                  )}
                </div>
                <div className="px-4 lg:pl-12 lg:px-0">
                  <Icon
                    img="/images/icon-dollar.png"
                    type="text"
                    text={`${price}`}
                  />
                  <Icon
                    img="/images/icon-product-type.png"
                    className="mt-5"
                    type="text"
                    text={eventData.type.includes("-") ? capitalizeFirstLetter(eventData.type).split("-").join(" ") : capitalizeFirstLetter(eventData.type)}
                  />
                  { eventData.type !== 'on-demand' &&
                    <>
                      <Icon
                        img="/images/icon-calendar.png"
                        className="mt-5"
                        type="date"
                        s_date={eventData.startDt}
                        e_date={eventData.endDt}
                      />
                      <Icon
                        img="/images/icon-time.png"
                        className="mt-5"
                        type="time"
                        text={eventData.startTime}
                      />
                      <Icon
                        img="/images/icon-address.png"
                        className="mt-5"
                        type="text"
                        text={eventData.address}
                      />
                    </>
                  }
                  <Icon
                    img="/images/icon-instruction.png"
                    className="mt-5"
                    type="text"
                    text={eventData.language}
                  />
                  <Icon
                    img="/images/icon-share.png"
                    className="mt-5 hidden"
                    type="social"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        <Heading3
          heading="Description"
          className="mb-4 uppercase mt-9 sm:mt-12 lg:mt-16"
        />
        <Richtext
          text={eventData.descHTML}
          className="mb-10 text-left lg:mb-10"
        />
        {expand && (
          <div>
            {Array(eventData.seriesMeta).map((dt, idx) =>
              dt.map((item, index) => (
                <div
                  className="items-center justify-start block mt-4 mb-10 lg:flex"
                  key={index}
                >
                  <Video
                    className="w-full lg:min-w-info lg:w-auto max-h-44 h-44"
                    src={item.file}
                  />
                  <div className="lg:ml-10">
                    <Heading3
                      heading={item.title}
                      className="mt-3 mb-3 uppercase"
                    />
                    <Text text={item.description} className="text-left" />
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        {eventData.seriesMeta.length > 0 && (
          <button
            className={`w-full text-center flex items-center text-lg justify-center font-bold py-3 bg-blue-850 text-white max-w-btn lg:mx-0 mx-auto`}
            onClick={toggleExpand}
          >
            Read {!expand ? 'More' : 'Less'}
          </button>
        )}

        {partnerForm && (
          <PartnerForm
            closeProp={() => setPartnerForm(false)}
            eventData={eventData}
            partnerBuyType={partnerBuyType}
          />
        )}
      </div>
      {openSuccess && (
        <Success
          open={openSuccess}
          icon="/images/success-check.png"
          title={`${eventData.name} has been added to your cart`}
          description="Continue to browse other classes and events"
          check={true}
          closeProp={() => {
            setOpenSuccess(false)
          }}
        />
      )}
    </>
  )
}
