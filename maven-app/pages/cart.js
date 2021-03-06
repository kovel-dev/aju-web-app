import React from 'react'
import Head from 'next/head'
import { query as q } from 'faunadb'
import { getSession } from 'next-auth/client'
import {
  CardContainer,
  CartContainer,
  Footer,
  Heading,
  MailingList,
  Navbar,
  Subheading,
} from '@components'
import { getUpcomingEvents } from 'lib/handlers/fauna-function-handlers'
import User from 'lib/models/user'
import { faunaClient } from 'lib/config/fauna'

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

  let upcomingEvents = await getUpcomingEvents(3)

  // check for authenticated user
  if (session !== null) {
    // if there's an authenticated user then get the cart meta
    let userRes = null
    try {
      await faunaClient
        .query(q.Get(q.Ref(q.Collection('users'), session.user.id)))
        .then(async (response) => {
          userRes = response.data
          //    check for cart meta
          let cartMeta = userRes.cart_meta

          if (cartMeta.length > 0) {
            let productIds = []
            for (let index = 0; index < cartMeta.length; index++) {
              //   loop the items to get the program tags
              const item = cartMeta[index]
              productIds.push(item.productId)
            }

            if (productIds.length > 0) {
              upcomingEvents = await getUpcomingEvents(3, productIds)

              if (upcomingEvents.length <= 0) {
                getUpcomingEvents(3)
              }
            }
          }
        })
    } catch (error) {
      // @TODO: Log error
    }
  }

  return {
    props: { session, upcomingEvents },
  }
}

export default function Cart(props) {
  return (
    <div className="min-h-fullpage">
      <Head>
        <title>Cart | AJU Maven</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <header className="w-full">
        <Navbar />
      </header>
      <main>
        <Heading heading="Shopping Cart" breadcrumbs={breadcrumbs} />

        <CartContainer session={props.session} />

        <Subheading content="Explore Similar Classes and Events" />

        <CardContainer schema={props.upcomingEvents} />
      </main>

      <MailingList />
      <Footer />
    </div>
  )
}
