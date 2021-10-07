import Footer from '../../components/footer'
import MailingList from '../../components/mailingList'
import Navbar from '../../components/navbar'
import Typography from '@components/typography'
import ScheduleSelector from '@components/scheduleSelector'
import ProgramContainer from '@components/blocks/programContainer'
import Link from 'next/link'
import CardContainer from '@components/blocks/cardContainer'
import Subheading from '@components/subheading'
import User from 'lib/models/user'
import Loader from '@components/loader'
import { Button } from '@components/form'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { getSession } from 'next-auth/client'
import { server } from '../../lib/config/server'
import Page from 'lib/models/pages'
import {
  getPageData,
  getFeaturedTags,
  getUpcomingEvents,
  getFeaturedPrograms,
} from '../../lib/handlers/fauna-function-handlers'
import { Meta } from '../../components'
import meta from '../../constants/meta'

// check user authentication before accessing this page
export async function getServerSideProps(context) {
  // session
  const session = await getSession({ req: context.req })
  if (!session) {
    return {
      redirect: {
        // eslint-disable-next-line no-undef
        destination: `${server}/login`,
        permanent: false,
      },
    }
  }
  // if role is not student redirect to organization dashboard
  if (session.user.role !== 'student') {
    return {
      redirect: {
        // eslint-disable-next-line no-undef
        destination: `${server}/organization/dashboard`,
        permanent: false,
      },
    }
  }
  // Fetch Initial Values from db
  let pageData = await getPageData('home')
  let featuredTags = {}
  let featuredTagsRefIDs = {}
  //If no values found, grab default values from model
  if (!pageData) {
    pageData = {}
  } else {
    //Get Featured Tags
    const pageDatafeaturedTags = pageData.featuredTags
    if (pageDatafeaturedTags) {
      featuredTagsRefIDs = pageDatafeaturedTags.map((tag) => {
        return tag.value
      })
      featuredTags = await getFeaturedTags(featuredTagsRefIDs)
    }
  }
  //Get Upcoming Events
  const upcomingEvents = await getUpcomingEvents(3)
  //Get Featured On-Demand Programs
  const featuredOnDemands = await getFeaturedPrograms('on-demand', 3)
  return {
    // set session and token
    props: {
      session,
      pageData,
      featuredTags,
      upcomingEvents,
      featuredOnDemands,
    },
  }
}

const Dashboard = (props) => {
  let user = new User({})
  const [userState, setUserState] = useState(user.getValues(true))
  const [errors, setErrors] = useState({})
  const [schedFrom, setSchedFrom] = useState('')
  const [schedTo, setSchedTo] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingProgram, setIsLoadingProgram] = useState(false)
  const [programs, setPrograms] = useState([])
  const router = useRouter()

  // get user after page load
  useEffect(async () => {
    // get current user
    getCurrentUser()
    getUpcomingPrograms()
  }, [])

  // get current user process
  const getCurrentUser = async () => {
    setIsLoading(true)

    // get user profile
    let userRes = null
    try {
      await user.getProfile().then((response) => {
        userRes = response
      })
    } catch (error) {
      setErrors(error)
      setIsLoading(false)
    }

    if (userRes) {
      // initialize response data to user model to format data
      user = new User(userRes)

      // set user data to userState
      setUserState(user.getValues(true))
      setIsLoading(false)
    }
  }

  const getUpcomingPrograms = async () => {
    setIsLoadingProgram(true)

    try {
      await Page.getStudentUpcomingEvents(schedFrom, schedTo, 'upcoming').then(
        (result) => {
          setPrograms(result.data)
          setIsLoadingProgram(false)
        }
      )
    } catch (error) {
      setErrors(error)
      setIsLoadingProgram(false)
    }
  }

  const dateButtonHandler = () => {
    getUpcomingPrograms()
  }

  return (
    <div className="min-h-fullpage">
      <Meta
        title={meta.individual.title}
        keywords={meta.individual.keywords}
        description={meta.individual.description}
      />
      <header className="w-full">
        <Navbar />
      </header>
      <main>
        {isLoading && (
          <div className="justify-center mx-auto max-w-wrapper mt-5 mb-5">
            <Loader />
          </div>
        )}
        {!isLoading && (
          <>
            <div className="px-5 mx-auto max-w-wrapper lg:mt-28 sm:mt-12 mt-6">
              <Typography variant="heading" className="text-center text-2xl">
                Welcome, {userState.first_name + ' ' + userState.last_name}
              </Typography>
              <div className="flex flex-col space-y-5 md:space-y-0 text-center md:space-x-12 lg:space-x-16 md:flex-row justify-center lg:px-8 lg:my-20 my-12">
                <Link href="/individual/my-classes-events">
                  <a className="bg-blue-850 text-white text-center py-6 font-bold flex items-center justify-center hover:opacity-80 md:w-1/3">
                    Go to My Class and Events
                  </a>
                </Link>
                <Link href="/individual/purchase-history">
                  <a className="bg-blue-850 text-white text-center py-6 font-bold md:flex items-center justify-center hover:opacity-80 md:w-1/3">
                    Go to My Purchase History
                  </a>
                </Link>
                <Link href="/individual/edit">
                  <a className="bg-blue-850 text-white text-center py-6 font-bold flex items-center justify-center hover:opacity-80 md:w-1/3">
                    Edit My Profile
                  </a>
                </Link>
              </div>
              <Typography
                variant="subheading-2"
                className="mb-2 text-center lg:mb-8 mb-12"
              >
                My Schedule
              </Typography>
              <ScheduleSelector
                schedFromProp={(newFrom) => {
                  setSchedFrom(newFrom)
                }}
                schedToProp={(newTo) => {
                  setSchedTo(newTo)
                }}
                defaultTo={schedTo}
                defaultFrom={schedFrom}
                buttonAction={dateButtonHandler}
              />
              {isLoadingProgram && (
                <div className="justify-center mx-auto max-w-wrapper mt-5 mb-5">
                  <Loader />
                </div>
              )}
              {/* {!isLoadingProgram && programs.length <= 0 && (
                <div className="justify-center mx-auto max-w-wrapper mt-5 mb-5">
                  <p className="text-center text-blue-850">
                    No Record(s) Found.
                  </p>
                </div>
              )} */}
              {!isLoadingProgram && programs.length > 0 && (
                <ProgramContainer loadMore={true} programs={programs} />
              )}
            </div>

            {Object.keys(props.upcomingEvents).length > 0 && (
              <>
                <Typography
                  variant="subheading-2"
                  className="mb-2 text-center lg:mb-8 hidden lg:block"
                >
                  Recommended For You
                </Typography>
                <div className="lg:hidden block -mb-3">
                  <Subheading content="Recommended For You" />
                </div>
                <CardContainer schema={props.upcomingEvents} />
                <div className="flex justify-center sm:my-12 mb-12 -mt-8">
                  <Button
                    buttonStyle="gray-outline"
                    type="button"
                    buttonContent="View All"
                    className="font-bold"
                    width="auto"
                    action={() => {
                      router.push('/events-classes')
                    }}
                  />
                </div>
              </>
            )}

            {props.featuredTags && Object.keys(props.featuredTags).length > 0 && (
              <>
                <div className="-mb-3 sm:mb-0">
                  <Subheading
                    content="Explore the world of Jewish learning."
                    subContent="Discover events and classes on topics you find engaging!"
                  />
                </div>
                <CardContainer schema={props.featuredTags} />
              </>
            )}
            {Object.keys(props.featuredOnDemands).length > 0 && (
              <>
                <div className="max-w-form -mb-3 sm:mb-0 mt-16 sm:mt-0 mx-auto">
                  <Subheading content="Don't have time to attend an event live? Check out our on demand library!" />
                </div>
                <CardContainer schema={props.featuredOnDemands} />
                <div className="flex justify-center sm:my-12 mb-12 -mt-8 px-5 sm:px-0">
                  <Button
                    buttonStyle="gray-outline"
                    type="button"
                    buttonContent="View On Demand Library"
                    className="font-bold"
                    width="auto"
                    action={() => {
                      router.push('/on-demand')
                    }}
                  />
                </div>
              </>
            )}
          </>
        )}
      </main>
      <MailingList />
      <Footer />
    </div>
  )
}

export default Dashboard
Dashboard.auth = true
