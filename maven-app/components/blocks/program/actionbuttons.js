import React, { useEffect, useState } from 'react'
import {
  Heading3,
  Heading4,
  Video,
  Icon,
  Text,
  Button,
  Richtext,
} from '../../partials'
import { useRouter } from 'next/router'
import ListMaterialPopup from '@components/popup/list-material'

function ActionButtons(props) {
  const router = useRouter()
  const [openPopup, setOpenPopup] = useState(false)
  const [location, setLocation] = useState('')

  useEffect(() => {
    setLocation('/events-classes/program/' + props.program.slug)
  }, [])

  const redirectToLoginPage = () => {
    router.push('/login?redirect=' + location)
  }

  const matertialButtonHandler = (productId) => {
    setOpenPopup(true)
  }

  return (
    <>
      {/* If user is not logged in */}
      {!props.session && (
        <>
          <div
            className={`lg:flex lg:space-x-7 ${
              props.isPartner ? 'lg:mt-12 lg:mb-16' : 'lg:pl-12 w-full'
            }`}
          >
            <div className="w-full max-w-btn flex items-center justify-center mx-auto lg:mx-0">
              <Button
                button="Log in to Register"
                className={`w-full mx-auto bg-blue-850 max-w-btn hover:opacity-80 focus:opacity-80`}
                fontSize="lg"
                action={() => redirectToLoginPage()}
              />
            </div>
          </div>
        </>
      )}
      {props.session &&
        props.entitlement.status &&
        props.program.type != 'on-demand' &&
        props.isProgramAccess && (
          <>
            <div
              className={`lg:flex lg:space-x-7 ${
                props.isPartner ? 'lg:mt-12 lg:mb-16' : 'lg:pl-12 w-full'
              }`}
            >
              <div className="flex items-center justify-center lg:justify-start mx-auto lg:mx-0">
                <a href={props.program.link} target="_blank" rel="noreferrer">
                  <Button
                    button="Join Now"
                    className={`w-full mx-auto bg-blue-850 max-w-btn px-12 hover:opacity-80 focus:opacity-80`}
                    fontSize="lg"
                  />
                </a>
              </div>
            </div>
          </>
        )}
      {/* If user is logged in and doesn't have entitlement */}
      {props.session && !props.entitlement.status && (
        <div
          className={`flex lg:flex-row flex-col items-center justify-center lg:justify-start space-x-0 space-y-5 lg:space-x-6 lg:space-y-0 ${
            props.isPartner ? 'lg:mt-12 lg:mb-16' : 'lg:pl-12 w-full'
          }`}
        >
          {/* If valid sales Period */}
          {props.validSalesPeriod ? (
            <>
              {/* User is a Student */}
              {!props.isPartner ? (
                <>
                  {parseInt(props.program.capacity) <= 0 && (
                    <>
                      {props.isOnWaitList && (
                        <p className="text-blue-850">
                          Already joined the waitlist.
                        </p>
                      )}

                      {!props.isOnWaitList && (
                        <div className="w-full max-w-btn">
                          <Button
                            button="Join Waitlist"
                            className="w-full bg-blue-850 max-w-btn hover:opacity-80 focus:opacity-80"
                            fontSize="lg"
                            action={() =>
                              props.joinWaitList(props.program.slug)
                            }
                          />
                        </div>
                      )}
                    </>
                  )}
                  {/* If program is NOT full and user is student, show add to cart and Register */}
                  {parseInt(props.program.capacity) > 0 && (
                    <>
                      <div className="w-full mx-auto lg:mx-0 max-w-btn">
                        <Button
                          button="Add to Cart"
                          className={`w-full mx-auto bg-blue-850 max-w-btn hover:opacity-80 focus:opacity-80`}
                          fontSize="lg"
                          action={() => props.addToCart(props.program.slug)}
                        />
                      </div>
                      <div className="w-full">
                        <Button
                          button="Register"
                          className={`w-full mx-auto ml-auto bg-blue-450 max-w-btn hover:opacity-80 focus:opacity-80`}
                          fontSize="lg"
                          action={() =>
                            props.addToCart(props.program.slug, true)
                          }
                        />
                      </div>
                    </>
                  )}
                </>
              ) : (
                <>
                  {/* user is Partner */}
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
                      props.setPartnerForm(true)
                      props.setPartnerBuyType('buy-class-event')
                      window.scrollTo(0, 30)
                    }}
                  />
                  <Button
                    button="Reserve Seats"
                    className={`w-full bg-blue-850 max-w-btn hover:opacity-80 focus:opacity-80`}
                    fontSize="lg"
                    action={() => {
                      props.setPartnerForm(true)
                      props.setPartnerBuyType('reserve-seats')
                      window.scrollTo(0, 30)
                    }}
                  />
                  {props.program.sponsorMaterialMeta.length > 0 && (
                    <Button
                      button="Marketing Materials"
                      className={`w-full mt-3 mx-auto bg-blue-850 lg:mt-0 lg:ml-10 max-w-btn opacity-70`}
                      fontSize="lg"
                      action={() => {
                        matertialButtonHandler()
                      }}
                    />
                  )}
                </>
              )}
            </>
          ) : (
            <>
              {/* User is a student */}
              {!props.isPartner ? (
                <>
                  {props.currentDtUTC <
                    props.program.millisecondRegistrationStartDt && (
                    <p className="text-red-500">
                      Program Registration Not Started
                    </p>
                  )}
                  {props.currentDtUTC >
                    props.program.millisecondRegistrationEndDt && (
                    <p className="text-red-500">Program Registration Ended</p>
                  )}
                </>
              ) : (
                <>
                  {/* user is Partner */}
                  {props.program.sponsorMaterialMeta.length > 0 && (
                    <Button
                      button="Marketing Materials"
                      className={`w-full ml-auto bg-blue-850 lg:mt-0${
                        props.partnerValidBuyButtons
                          ? ' lg:ml-0 mt-3'
                          : ' lg:ml-0'
                      } max-w-btn opacity-70 mr-auto`}
                      fontSize="lg"
                      action={() => {
                        matertialButtonHandler()
                      }}
                    />
                  )}
                </>
              )}
            </>
          )}
        </div>
      )}
      {openPopup && (
        <ListMaterialPopup
          open={openPopup}
          items={props.program.sponsorMaterialMeta}
          closeProp={() => {
            setOpenPopup(false)
          }}
        />
      )}
    </>
  )
}

export default ActionButtons
