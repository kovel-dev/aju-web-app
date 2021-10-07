import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Cart from 'lib/models/cart'
import StepConfirm from '@components/blocks/cart-step/stepConfirm'
import { getSession } from 'next-auth/client'
import {
  CardContainer,
  Footer,
  Heading,
  MailingList,
  Meta,
  Navbar,
  Step,
  Subheading,
} from '@components'
import Loader from '@components/loader'
import { useRouter } from 'next/router'
import { getErrorMessage, hasError } from 'lib/validations/validations'
import { getUpcomingEvents } from 'lib/handlers/fauna-function-handlers'
import meta from 'constants/meta'

const breadcrumbs = [
  {
    link: '/',
    label: 'Home',
  },
  {
    link: '/events-classes',
    label: 'Events & Classes',
  },
  {
    link: '/cart',
    label: 'Cart',
  },
]

export async function getServerSideProps(context) {
  // session
  const session = await getSession({ req: context.req })

  //Get Upcoming Events
  const upcomingEvents = await getUpcomingEvents(3)

  return {
    // set session and token
    props: { session, upcomingEvents },
  }
}

const stepNames = ['Order Summary', 'Payment Details', 'Confirmation']

export default function ConfirmationPage(props) {
  let cart = new Cart({})
  // variable to toggle loading gif
  const [isLoading, setIsLoading] = useState(true)
  // variable to containe the products in user's cart
  const [confirmationInfo, setConfirmationInfo] = useState(false)
  // variable to toggle error message
  const [errors, setErrors] = useState({})

  const [userInfo, setUserInfo] = useState([])

  const router = useRouter()

  useEffect(async () => {
    if (router.isReady) {
      let { orderId, slug } = router.query

      try {
        await cart.getConfirmationRecord(orderId, slug).then((result) => {
          setConfirmationInfo(result.order)
          setUserInfo(result.user)
        })
      } catch (error) {
        setErrors(error)
      }
      setIsLoading(false)
    }
  }, [])

  return (
    <div className="min-h-fullpage">
      <Meta
        title={meta.cart.title}
        keywords={meta.cart.keywords}
        description={meta.cart.description}
      />
      <header className="w-full">
        <Navbar />
      </header>
      <main>
        <Heading heading="Shopping Cart" breadcrumbs={breadcrumbs} />
        <>
          {isLoading && <Loader message={'Loading...'} />}
          {confirmationInfo && !isLoading && (
            <div className="">
              <Step stepNames={stepNames} currentStep={3}>
                <StepConfirm
                  key={3}
                  confirmationInfo={confirmationInfo}
                  user={userInfo}
                />
              </Step>
            </div>
          )}
          {confirmationInfo && !isLoading && errors.length <= 0 && (
            <div className="justify-center mx-auto max-w-wrapper">
              <p className="text-center">No item(s) found.</p>
            </div>
          )}
          {!isLoading && hasError(errors, 'general') && (
            <div className="justify-center mx-auto max-w-wrapper">
              <p className="text-center text-red-600">
                {getErrorMessage(errors, 'general')}
              </p>
            </div>
          )}
        </>
        <Subheading content="Explore Similar Classes and Events" />
        <CardContainer schema={props.upcomingEvents} />
      </main>
      <MailingList />
      <Footer />
    </div>
  )
}
