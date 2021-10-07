import React from 'react'
import axios from 'axios'
import { getUpcomingEvents } from '../lib/handlers/fauna-function-handlers'

export async function getServerSideProps(context) {
  //Step 1 : Fetch Initial Values from db
  let filterData = await axios
    .post(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/search/advance-search`, {
      tagRef: '',
      hostRef: '',
      type: '',
      level: '',
      deliveryType: '',
      sponsorRef: '',
    })
    .then((response) => {
      return response
    })
    .catch((error) => {
      throw error.response.data
    })

  console.log(filterData.data, 'filterData')

  return {
    props: {}, // will be passed to the page component as props
  }
}

function eventstest() {
  return <div></div>
}

export default eventstest
