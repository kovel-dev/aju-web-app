/* eslint-disable */
import { useRouter } from 'next/router'
import classEventData from '../../utils/purchasedData.json'

import Head from 'next/head'
import Navbar from '../../components/navbar'
import Footer from '../../components/footer'
import Heading from '../../components/heading'
import MailingList from '../../components/mailingList'
import Subheading from '../../components/subheading'

import ProfileContainer from '../../components/blocks/profileContainer'
import CardContainer from './../../components/blocks/cardContainer'
import EventContainer from '../../components/blocks/eventContainer'

const profileSchema = [
  {
    firstName: 'Chloe',
    lastName: 'Noland',
    job: 'Program Operations Specialist',
    speaker: false,
    img: 'https://images.unsplash.com/photo-1564832586408-3b10f4f41541?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1190&q=80',
    bio: '0 Sherre Hirsch is the Chief Innovation Officer at American Jewish University. She made headlines as the first female rabbi at Sinai Temple, the largest Conservative congregation on the west coast. She served as Senior Rabbinic Scholar at Hillel International, where she created and developed Hillelwell, an initiative for Hillels worldwide to become the recognized address for preventative mental health. A thought leader and author on spirituality and religion, Rabbi Hirsch has appeared on the Today Show, ABC News, Extra, and PBS, among other outlets, and has been a contributor to Time.com, Oprah Magazine, the Jewish Journal, the Hollywood Journal, and more.',
  },
  {
    firstName: 'Chloe',
    lastName: 'Noland',
    job: 'Program Operations Specialist',
    speaker: false,
    img: 'https://images.unsplash.com/photo-1564832586408-3b10f4f41541?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1190&q=80',
    bio: '1 Sherre Hirsch is the Chief Innovation Officer at American Jewish University. She made headlines as the first female rabbi at Sinai Temple, the largest Conservative congregation on the west coast. She served as Senior Rabbinic Scholar at Hillel International, where she created and developed Hillelwell, an initiative for Hillels worldwide to become the recognized address for preventative mental health. A thought leader and author on spirituality and religion, Rabbi Hirsch has appeared on the Today Show, ABC News, Extra, and PBS, among other outlets, and has been a contributor to Time.com, Oprah Magazine, the Jewish Journal, the Hollywood Journal, and more.',
  },
  {
    firstName: 'Chloe',
    lastName: 'Noland',
    job: 'Program Operations Specialist',
    speaker: false,
    img: 'https://images.unsplash.com/photo-1564832586408-3b10f4f41541?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1190&q=80',
    bio: '2 Sherre Hirsch is the Chief Innovation Officer at American Jewish University. She made headlines as the first female rabbi at Sinai Temple, the largest Conservative congregation on the west coast. She served as Senior Rabbinic Scholar at Hillel International, where she created and developed Hillelwell, an initiative for Hillels worldwide to become the recognized address for preventative mental health. A thought leader and author on spirituality and religion, Rabbi Hirsch has appeared on the Today Show, ABC News, Extra, and PBS, among other outlets, and has been a contributor to Time.com, Oprah Magazine, the Jewish Journal, the Hollywood Journal, and more.',
  },
]

const eventSchema = [
  {
    img: 'https://images.unsplash.com/photo-1564832586408-3b10f4f41541?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1190&q=80',
    link: '/hebrew',
    month: 'April',
    day: '21',
    title: 'Sed ut perspicita',
    description:
      'Nemo eneim ipasam voluialf quiaf skfdjaiufa sit asfkljdsfi s oid a dkflas idsfla jldkssldflao fasdhlsd. Askdfjlskfja  dfkslf NEefkasfdl.',
  },
  {
    img: 'https://images.unsplash.com/photo-1564832586408-3b10f4f41541?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1190&q=80',
    link: '/hebrew',
    month: 'April',
    day: '21',
    title: 'Sed ut perspicita',
    description:
      'Nemo eneim ipasam voluialf quiaf skfdjaiufa sit asfkljdsfi s oid a dkflas idsfla jldkssldflao fasdhlsd. Askdfjlskfja  dfkslf NEefkasfdl.',
  },
  {
    img: 'https://images.unsplash.com/photo-1564832586408-3b10f4f41541?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1190&q=80',
    link: '/hebrew',
    month: 'April',
    day: '21',
    title: 'Sed ut perspicita',
    description:
      'Nemo eneim ipasam voluialf quiaf skfdjaiufa sit asfkljdsfi s oid a dkflas idsfla jldkssldflao fasdhlsd. Askdfjlskfja  dfkslf NEefkasfdl.',
  },
]

function ClassEvent() {
  // function ClassEvent({ params, classes }) {
  // const { id } = params
  // const eventData = classes[id]

  return (
    <div className="min-h-fullpage">
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      {/* <header className="w-full">
        <Navbar />
      </header> */}
      {/* <main>
        <Heading
          breadcrumbs={[
            {
              link: '/',
              label: 'Home',
            },
            {
              link: '/my-account',
              label: 'My Account',
            },
            {
              link: '/' + id,
              label: eventData.event_name,
            },
          ]}
        /> */}

      {/* <EventContainer eventData={eventData} purchased={true} session={true} /> */}

      {/* <Subheading
          content="Meet the AJU Maven Team"
        /> */}
      {/* <ProfileContainer schema={profileSchema} /> */}

      {/* <Subheading content="Explore Similar Classes and Events" /> */}

      {/* <CardContainer schema={eventSchema} /> */}
      {/* </main> */}
      <MailingList />
      <Footer />
    </div>
  )
}

// export async function getStaticPaths() {
//   const classes = classEventData

//   const paths = Object.keys(classes).map(function (key, index) {
//     return {
//       params: { id: key },
//     }
//   })

//   return {
//     paths,
//     fallback: false,
//   }
// }

// export async function getStaticProps({ params }) {
//   const classes = classEventData

//   return {
//     props: {
//       params,
//       classes,
//     },
//   }
// }

export default ClassEvent
