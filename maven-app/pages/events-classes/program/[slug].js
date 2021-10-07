//React libraries
import Head from 'next/head'
import React from 'react'
import { useState, useEffect } from 'react'
import { getSession } from 'next-auth/client'
import moment from 'moment'
var momentTz = require('moment-timezone')

//Custom Helpers
import {
  getProductBySlug,
  checkProgramEntitlement,
  isOnWaitlist,
} from '../../../lib/handlers/fauna-function-handlers'
import {
  getSimilarPrograms,
  getProgramHosts,
  getProgramSeries,
} from '../../../lib/handlers/helper-handlers'

//Import custom components
import Navbar from '../../../components/navbar'
import Footer from '../../../components/footer'
import Heading from '../../../components/heading'
import MailingList from '../../../components/mailingList'
import Subheading from '../../../components/subheading'
import ProfileContainer from '../../../components/blocks/profileContainer'
import CardContainer from '../../../components/blocks/cardContainer'
import EventContainer from '../../../components/blocks/eventContainer'
import ProgramFrame from '../../../components/blocks/program/frame'
import {
  ContentState,
  convertToRaw,
  EditorState,
  convertFromRaw,
  convertFromHTML,
} from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import Meta from '@components/meta'

export async function getServerSideProps(context) {
  // session
  const session = await getSession({ req: context.req })
  const userId = session ? session.user.id : ''
  //Default TimeZone
  let userTimezone = 'America/Los_Angeles'
  // if (userId) {
  //   if (session.user.timezone) {
  //     userTimezone = session.user.timezone
  //   }
  // }

  const { slug } = context.query

  //Get Product details
  const programObj = await getProductBySlug(slug)
  if (!programObj) {
    //No product found. Redirect to new page
    return {
      redirect: {
        destination: '/404',
        permanent: false,
      },
    }
  }
  const program = programObj.data
  const programId = programObj['ref'].id

  //Check if user has entitlement
  const rawEntitlementData = await checkProgramEntitlement(
    programId,
    userId,
    'array'
  )
  const entitlement = {
    status: rawEntitlementData.length > 0 ? true : false,
    orderCreatedAt:
      rawEntitlementData.length > 0 ? rawEntitlementData[2] : false,
    orderId: rawEntitlementData.length > 0 ? rawEntitlementData[0] : false,
  }
  let isOnWaitList = false

  if (userId && userId.length > 0) {
    isOnWaitList = await isOnWaitlist(programId, userId)
  }

  return {
    // set session and token
    props: {
      session,
      program,
      programId,
      slug,
      entitlement,
      userTimezone,
      isOnWaitList,
    },
  }
}

function ProductPage(props) {
  //const userId = props.session ? props.session.user.id : ''
  const program = props.program
  const programId = props.programId
  const slug = props.slug
  const [productState, setProductState] = useState(program)
  const [similarPrograms, setSimilarPrograms] = useState([])
  const [similarProgramsparam, setSimilarProgramsparam] = useState({})
  const [hostState, setHostsState] = useState([])
  const [seriesState, setSeriesState] = useState([])

  useEffect(() => {
    if (program) {
      setProductState(program)
      buildProgramPage()
    }
  }, [program])

  //Check if user is partner or not
  const isPartner =
    props.session && props.session.user.role === 'partner' ? true : false

  //Compute Program info and pull other related info
  const buildProgramPage = async () => {
    //Fetch Similar Programs start
    let productTagRefs = []
    if (program.tagMeta.length > 0) {
      program.tagMeta.map((tag, index) => {
        productTagRefs.push(tag.value)
      })
    }
    const similarProdsParams = {
      tags: productTagRefs,
      progRef: programId,
    }
    setSimilarProgramsparam(similarProdsParams)
    //Fetch Similar Programs End - calls its own useEffect
    //Fetch Hosts

    let hostRoleRefs = []
    if (program.hostRoleMeta && program.hostRoleMeta.length > 0) {
      program.hostRoleMeta.map((hostRole, index) => {
        hostRoleRefs.push(hostRole[0])
      })
    }
    const hosts = await getProgramHosts(hostRoleRefs)
      .then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          //Host Description convertor start
          let host = response.data[i]

          if (host.description) {
            let state
            try {
              state = convertFromRaw(JSON.parse(host.description))
            } catch {
              const blocksFromHTML = convertFromHTML(
                `<p>${host.description}<p>`
              )
              state = ContentState.createFromBlockArray(
                blocksFromHTML.contentBlocks,
                blocksFromHTML.entityMap
              )
            }

            let descHTML = ''
            try {
              const rawContentState = convertToRaw(state)
              descHTML = draftToHtml(rawContentState)
            } catch (err) {
              console.log(err, 'err from draft')
            }
            response.data[i].bio = descHTML
          }
          //Host Description convertor end
        }
        setHostsState(response.data)
      })
      .catch((error) => {
        console.log(error, 'errorCaught')
      })
    //Fetch Hosts End
    if (props.program.type == 'series') {
      //Fetch series
      const series = await getProgramSeries(props.program.seriesMeta)
        .then((response) => {
          props.program.seriesMeta = response.data
        })
        .catch((error) => {
          console.log(error, 'errorCaught')
        })
      //Fetch series End
    }
  }

  useEffect(async () => {
    //Call to build Product page once the page is loaded.
    const buildPage = await buildProgramPage()
  }, [])

  //Call to fetch Similar Programs
  useEffect(async () => {
    let similarPrograms = []
    if (Object.keys(similarProgramsparam).length > 0) {
      similarPrograms = await getSimilarPrograms(similarProgramsparam)
    }
    setSimilarPrograms(similarPrograms.data)
  }, [similarProgramsparam])

  useEffect(() => {
    //Product Description convertor start
    if (props.program.description) {
      let state
      try {
        state = convertFromRaw(JSON.parse(props.program.description))
      } catch {
        const blocksFromHTML = convertFromHTML(
          `<p>${props.program.description}<p>`
        )
        state = ContentState.createFromBlockArray(
          blocksFromHTML.contentBlocks,
          blocksFromHTML.entityMap
        )
      }

      let descHTML = ''
      try {
        const rawContentState = convertToRaw(state)
        descHTML = draftToHtml(rawContentState)
      } catch (err) {
        console.log(err, 'err from draft')
      }
      props.program.descHTML = descHTML
    }
    //Product Description convertor end
  }, [props.program.description])

  return (
    <div className="min-h-fullpage">
      <Meta
        title={
          program.seoTitle ? program.seoTitle : program.name + ' | AJU Maven'
        }
        keywords={
          program.seoKeywords ? program.seoKeywords : program.name.toLowerCase()
        }
        description={
          program.seoDesc ? program.seoDesc : program.shortDescription
        }
        image={program.imageUrl}
      />
      <header className="w-full">
        <Navbar />
      </header>
      <main>
        <Heading
          breadcrumbs={[
            {
              link: '/',
              label: 'Home',
            },
            {
              link: '/events-classes',
              label: 'Events & Classes',
            },
            {
              link: '/' + slug,
              //label: eventData.event_name
              label: program.name,
            },
          ]}
        />
        <ProgramFrame
          program={productState}
          isPartner={isPartner}
          entitlement={props.entitlement}
          userTimezone={props.userTimezone}
          session={props.session}
          isOnWaitList={props.isOnWaitList}
        />

        {hostState.length > 0 && (
          <ProfileContainer schema={hostState} page="product" />
        )}

        {/* Space for second Banner removed */}
        {/* {program.bannerMeta.length > 1 && program.bannerMeta[1][0].file && (
          <div className="py-4 px-5 mx-auto mt-2 mb-2 max-w-wrapper lg:my-4">
            <img
              src={program.bannerMeta[1][0].file}
              className="max-w-full h-auto"
            />
          </div>
        )} */}

        <Subheading content="Explore Similar Classes and Events" />

        <CardContainer schema={similarPrograms} />
      </main>
      <MailingList />
      <Footer />
    </div>
  )
}

export default ProductPage
