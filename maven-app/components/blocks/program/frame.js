import React, { useState, useEffect } from 'react'
import {
  Heading3,
  Heading4,
  Icon,
  Text,
  Button,
  Richtext,
  Content,
} from '../../partials'
import ActionButtons from './actionbuttons'
import PartnerForm from '@components/form/partnerForm'
import moment from 'moment'
import { session } from 'next-auth/client'
import Cart from 'lib/models/cart'
import { useRouter } from 'next/router'
import { getLanguagesOfCommunication } from '../../../lib/handlers/dropdown-handlers'
import { formatOptions } from '../../../lib/handlers/helper-handlers'
import Success from '@components/popup/success'
import Loader from '@components/loader'
var momentTz = require('moment-timezone')

function ProgramBase({
  program,
  isPartner,
  entitlement,
  userTimezone,
  session,
  isOnWaitList,
}) {
  // variable to toggle loading gif
  const [isLoading, setIsLoading] = useState(false)
  // variable to toggle error message
  const [errors, setErrors] = useState({})
  // variable to toggle success message
  const [openSuccess, setOpenSuccess] = useState(false)
  const [openSuccessJoinWaitlist, setOpenSuccessJoinWaitlist] = useState(false)
  const [isOnWaitListState, setIsOnWaitList] = useState(isOnWaitList)

  const [partnerForm, setPartnerForm] = useState(false)
  const [partnerBuyType, setPartnerBuyType] = useState('')
  const [expand, setExpand] = useState(false)
  const router = useRouter()

  let cart = new Cart({})

  let entitlmentExpiryDateUserTimezone = ''
  let currentDtUTC = moment.utc(new Date()).valueOf()
  const price = program.price > 0 ? '$' + program.price : 'Free'

  let language = 'English'
  if (program.language) {
    language = formatOptions(getLanguagesOfCommunication()).find(
      (o) => o.key === program.language
    )
  }

  let isProgramAccess = false
  if (entitlement.status && program.type == 'on-demand') {
    var utcMomemtCreatedAtWithAddedTime = moment.tz(
      moment(entitlement.orderCreatedAt).add(48, 'hours'),
      'UTC'
    )
    // expiry time in ms -> utcMomemtCreatedAtWithAddedTime.valueOf()
    entitlmentExpiryDateUserTimezone = utcMomemtCreatedAtWithAddedTime
      .tz(userTimezone)
      .format('Do MMM YYYY h:mm a (z)')

    isProgramAccess =
      currentDtUTC <= utcMomemtCreatedAtWithAddedTime.valueOf() ? true : false
  } else {
    let startDateBefore5Min = moment.tz(
      moment(program.millisecondStartDt).subtract(5, 'minutes'),
      'UTC'
    )
    if (
      currentDtUTC >= startDateBefore5Min.valueOf() &&
      currentDtUTC < program.millisecondEndDt
    ) {
      isProgramAccess = true
    }
  }
  //Program Date conversions
  // let programStartDateTime = moment.tz(
  //   moment(program.millisecondStartDt),
  //   'UTC'
  // )
  let programStartDateTimeUserTimeZone = moment
    .tz(moment(program.millisecondStartDt), 'UTC')
    .tz(userTimezone)
  let programEndDateTimeUserTimeZone = moment
    .tz(moment(program.millisecondEndDt), 'UTC')
    .tz(userTimezone)
  let userTimezoneAbbr = programStartDateTimeUserTimeZone.format(' (z)')

  //check if valid sales period
  let validSalesPeriod = false
  let partnerValidBuyButtons = false
  if (session && session.user.role === 'partner') {
    if (currentDtUTC < program.millisecondRegistrationStartDt) {
      validSalesPeriod = true
    }
    if (currentDtUTC < program.millisecondRegistrationEndDt) {
      partnerValidBuyButtons = true
    }
  } else {
    if (
      currentDtUTC >= program.millisecondRegistrationStartDt &&
      currentDtUTC <= program.millisecondRegistrationEndDt
    ) {
      validSalesPeriod = true
    }
  }

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

  const joinWaitList = async (slug) => {
    setIsLoading(true)
    setErrors({})

    try {
      await cart.joinWaitList(slug).then((result) => {
        setIsOnWaitList(true)
        setOpenSuccessJoinWaitlist(true)
        setIsLoading(false)
      })
    } catch (error) {
      setErrors(error)
      setIsLoading(false)
    }
  }

  const toggleExpand = () => {
    setExpand(!expand)
  }

  return (
    <>
      {/* Program Page container */}
      <div
        className="px-5 mx-auto mt-10 mb-20 max-w-wrapper lg:my-14"
        aria-label="program page data holder"
      >
        {/* Program Page First Section */}
        <div className="flex flex-col flex-wrap items-start -mx-4 text-primary">
          <div className={`w-full px-4 ${!isPartner ? 'lg:flex' : ''}`}>
            <div
              className={
                isPartner
                  ? 'lg:mb-7'
                  : 'lg:min-w-video lg:w-video xl:min-w-videoxl'
              }
            >
              <Heading3
                heading={program.name}
                className="mb-3 uppercase lg:mb-5"
              />
              <Text
                text={program.shortDescription}
                className="mb-2 text-left lg:mb-6"
              />
              {entitlement.status && (
                <>
                  {program.type == 'on-demand' ? (
                    <>
                      <Heading4
                        heading={
                          'Access expires on: ' +
                          entitlmentExpiryDateUserTimezone
                        }
                        className="mb-3"
                      />
                    </>
                  ) : (
                    <>
                      <Heading4
                        heading={
                          isProgramAccess ? (
                            'You are registered. Click on Join Now button'
                          ) : (
                            <>
                              {currentDtUTC >=
                              program.millisecondRegistrationEndDt
                                ? 'This program has already occurred.'
                                : 'You are registered. Please check back 5 minutes before the start time to join or check your email for the link.'}
                            </>
                          )
                        }
                        className="mb-3"
                      />
                    </>
                  )}
                </>
              )}
            </div>
            <div className="hidden lg:block w-full">
              {isLoading && <Loader message="Processing..." />}
              {!isLoading && (
                <ActionButtons
                  program={program}
                  entitlement={entitlement}
                  isPartner={isPartner}
                  session={session}
                  validSalesPeriod={validSalesPeriod}
                  partnerValidBuyButtons={partnerValidBuyButtons}
                  addToCart={addToCart}
                  setPartnerForm={setPartnerForm}
                  setPartnerBuyType={setPartnerBuyType}
                  currentDtUTC={currentDtUTC}
                  isProgramAccess={isProgramAccess}
                  joinWaitList={joinWaitList}
                  isOnWaitList={isOnWaitListState}
                />
              )}
            </div>
          </div>
          <div className="flex flex-col w-full mt-4 lg:mt-0 lg:flex-row lg:px-4">
            <div>
              <Content
                className={`w-full h-auto ${
                  !entitlement.status
                    ? 'lg:max-w-4xl lg:min-w-video lg:w-video xl:min-w-videoxl'
                    : ''
                }`}
                src={program.imageUrl}
                entitlement={entitlement.status}
                type={program.type}
                videoLink={program.link}
                isProgramAccess={isProgramAccess}
              />
              {program.bannerMeta.length > 0 && program.bannerMeta[0][0].file && (
                <div className="sm:py-4 overflow-hidden mt-3 w-full lg:max-w-4xl lg:min-w-video lg:w-video xl:min-w-videoxl">
                  <img
                    src={program.bannerMeta[0][0].file}
                    className="max-w-full h-auto object-center object-cover"
                  />
                </div>
              )}
            </div>
            <div className="block lg:hidden mt-9 mb-5">
              {isLoading && <Loader message="Processing..." />}
              {!isLoading && (
                <ActionButtons
                  program={program}
                  entitlement={entitlement}
                  isPartner={isPartner}
                  session={session}
                  validSalesPeriod={validSalesPeriod}
                  partnerValidBuyButtons={partnerValidBuyButtons}
                  addToCart={addToCart}
                  setPartnerForm={setPartnerForm}
                  setPartnerBuyType={setPartnerBuyType}
                  currentDtUTC={currentDtUTC}
                  isProgramAccess={isProgramAccess}
                  joinWaitList={joinWaitList}
                  isOnWaitList={isOnWaitListState}
                />
              )}
            </div>
            <div className="px-4 lg:pl-12 pt-4 lg:px-0">
              <Icon
                img="/images/icon-dollar.png"
                type="text"
                text={`${price}`}
              />
              <Icon
                img="/images/icon-product-type.png"
                className="mt-5 capitalize"
                type="text"
                text={
                  (program.type.includes('-')
                    ? program.type.split('-').join(' ')
                    : program.type) +
                  (program.type === 'series'
                    ? ' - ' + program.seriesMeta.length + ' sessions'
                    : '')
                }
              />
              {program.type !== 'on-demand' && (
                <>
                  {program.type === 'series' && (
                    <Icon
                      img="/images/icon-calendar.png"
                      className="mt-5"
                      type="text"
                      text={programStartDateTimeUserTimeZone.format('dddd[s]')}
                    />
                  )}
                  <Icon
                    img="/images/icon-calendar.png"
                    className="mt-5"
                    type={program.type === 'series' ? 'date' : 'text'}
                    text={programStartDateTimeUserTimeZone.format(
                      'dddd, MMMM DD, YYYY'
                    )}
                    s_date={programStartDateTimeUserTimeZone.format(
                      'Do MMM YYYY'
                    )}
                    e_date={programEndDateTimeUserTimeZone.format(
                      'Do MMM YYYY'
                    )}
                  />
                  <Icon
                    img="/images/icon-time.png"
                    className="mt-5"
                    type={program.type === 'series' ? 'date' : 'time'}
                    text={
                      programStartDateTimeUserTimeZone.format('h:mm a') +
                      ' - ' +
                      programEndDateTimeUserTimeZone.format('h:mm a') +
                      userTimezoneAbbr
                    }
                    s_date={programStartDateTimeUserTimeZone.format('h:mm a')}
                    e_date={
                      programEndDateTimeUserTimeZone.format('h:mm a') +
                      userTimezoneAbbr
                    }
                  />
                  <Icon
                    img="/images/icon-address.png"
                    className="mt-5"
                    type="text"
                    text={
                      program.deliveryType === 'in-person'
                        ? program.address
                        : 'Online'
                    }
                  />
                </>
              )}
              <Icon
                img="/images/icon-instruction.png"
                className="mt-5"
                type="text"
                text={
                  program.language && language.value ? language.value : language
                }
              />
              <Icon
                img="/images/icon-share.png"
                className="mt-5 hidden"
                type="social"
              />
            </div>
          </div>
        </div>
        <Heading3
          heading="Description"
          className="mb-4 uppercase mt-5 sm:mt-12 lg:mt-10"
        />
        <Richtext
          text={program.descHTML}
          className="mb-10 text-left lg:mb-10"
        />
        {expand && (
          <div>
            {Array(program.seriesMeta).map((dt, idx) =>
              dt.map((item, index) => (
                <div
                  className="items-center justify-start block mt-4 mb-10 lg:flex"
                  key={index}
                >
                  <Content
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
        {program.seriesMeta.length > 0 && (
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
            eventData={program}
            partnerBuyType={partnerBuyType}
          />
        )}
      </div>

      {openSuccess && (
        <Success
          open={openSuccess}
          icon="/images/success-check.png"
          title={`${program.name} has been added to your cart`}
          description="Continue to browse other classes and events"
          check={true}
          closeProp={() => {
            setOpenSuccess(false)
          }}
        />
      )}
      {openSuccessJoinWaitlist && (
        <Success
          open={openSuccessJoinWaitlist}
          icon="/images/success-check.png"
          title={`You’ve been added to the waitlist`}
          description="Continue to browse other classes and events"
          check={true}
          closeProp={() => {
            setOpenSuccessJoinWaitlist(false)
          }}
        />
      )}
    </>
  )
}

export default ProgramBase
