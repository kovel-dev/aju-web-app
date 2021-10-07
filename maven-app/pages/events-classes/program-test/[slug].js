import Head from 'next/head'
import React from 'react'
import { useState, useEffect } from 'react'
import { getSession } from 'next-auth/client'
import moment from 'moment'
var momentTz = require('moment-timezone')
import { useRouter } from 'next/router'

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
import Product from 'lib/models/product'
import Notfound from '../../../components/notFound'
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

  return {
    // set session and token
    props: {
      session,
      slug,
      userTimezone,
      userId,
    },
  }
}

function ProductPage(props) {
  // variable to toggle loading gif
  const [isLoading, setIsLoading] = useState(true)
  // variable to toggle error message
  const [hasError, setHasError] = useState(false)
  const [program, setProgram] = useState()
  const [programId, setProgramId] = useState()
  const [entitlement, setEntitlement] = useState()
  const [isOnWaitList, setIsOnWaitList] = useState()
  const [similarProgramsparam, setSimilarProgramsparam] = useState({})
  const [similarPrograms, setSimilarPrograms] = useState([])
  const [hostState, setHostsState] = useState([])
  const [empty, setEmpty] = useState(false)
  const router = useRouter()
  let product = new Product()
  const slug = props.slug

  //Check if user is partner or not
  const isPartner =
    props.session && props.session.user.role === 'partner' ? true : false

  useEffect(async () => {
    setIsLoading(true)
    if (router.isReady) {
      await product
        .getAllProductsbySlug(slug)
        .then(async (responce) => {
          console.log(responce.data.ref['@ref'].id, 'responce')
          if (responce.data.data) {
            setProgram(responce.data.data)
            setProgramId(responce.data.ref['@ref'].id)

            //Check if user has entitlement
            const rawEntitlementData = await product
              .checkProgramEntitlement(
                responce.data.ref['@ref'].id,
                props.userId,
                'array'
              )
              .then((rawEntitlementData) => {
                const entitlement = {
                  status: rawEntitlementData.data.length > 0 ? true : false,
                  orderCreatedAt:
                    rawEntitlementData.data.length > 0
                      ? rawEntitlementData.data[2]
                      : false,
                  orderId:
                    rawEntitlementData.data.length > 0
                      ? rawEntitlementData.data[0]
                      : false,
                }
                setEntitlement(entitlement)
              })

            //check waitlist
            const isOnWaitList = await product
              .OnWaitlist(responce.data.ref['@ref'].id, props.userId)
              .then((isOnWaitList) => {
                setIsOnWaitList(isOnWaitList.data)
              })
            const buildPage = await buildProgramPage(
              responce.data.data,
              responce.data.ref['@ref'].id
            )
            setIsLoading(false)
          } else {
            setEmpty(true)
            setIsLoading(false)
          }
        })
        .catch((error) => {
          console.log(error, 'errorCaught')
          setHasError(true)
          setIsLoading(true)
        })
    }
  }, [slug])

  //Compute Program info and pull other related info
  const buildProgramPage = async (program, programId) => {
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
    const hosts = await getProgramHosts(program.hostMeta)
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
    if (program.type == 'series') {
      //Fetch series
      const series = await getProgramSeries(program.seriesMeta)
        .then((response) => {
          program.seriesMeta = response.data
        })
        .catch((error) => {
          console.log(error, 'errorCaught')
        })
      //Fetch series End
    }
  }

  //Call to fetch Similar Programs
  useEffect(async () => {
    let similarPrograms = []
    console.log(`similarProgramsparam`, similarProgramsparam)
    if (Object.keys(similarProgramsparam).length > 0) {
      similarPrograms = await getSimilarPrograms(similarProgramsparam)
    }
    setSimilarPrograms(similarPrograms.data)
  }, [similarProgramsparam])

  return (
    <div className="min-h-fullpage">
      {empty ? (
        <Notfound />
      ) : (
        <>
          {isLoading || hasError ? (
            <div className="border border-blue-300 shadow rounded-md p-4 max-w-sm w-full mx-auto mb-16">
              <div className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-blue-400 h-12 w-12"></div>
                <div className="flex-1 space-y-4 py-1">
                  <div className="h-4 bg-blue-400 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-blue-400 rounded"></div>
                    <div className="h-4 bg-blue-400 rounded w-5/6"></div>
                  </div>
                  {hasError ? <div>Something Went Wrong!!!</div> : ' '}
                </div>
              </div>
            </div>
          ) : (
            <>
              <Meta
                title={program.name + ' | Online Jewish Learning | AJU Maven'}
                keywords={program.name.toLowerCase()}
                description={program.shortDescription}
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
                  program={program}
                  isPartner={isPartner}
                  entitlement={entitlement}
                  userTimezone={props.userTimezone}
                  session={props.session}
                  isOnWaitList={isOnWaitList}
                />

                {hostState.length > 0 && (
                  <ProfileContainer schema={hostState} page="product" />
                )}

                {program.bannerMeta.length > 1 &&
                  program.bannerMeta[1][0].file && (
                    <div className="py-4 px-5 mx-auto mt-2 mb-2 max-w-wrapper lg:my-4">
                      <img
                        src={program.bannerMeta[1][0].file}
                        className="max-w-full h-auto"
                      />
                    </div>
                  )}

                <Subheading content="Explore Similar Classes and Events" />

                <CardContainer schema={similarPrograms} />
              </main>
              <MailingList />
              <Footer />
            </>
          )}
        </>
      )}
    </div>
  )
}

export default ProductPage
