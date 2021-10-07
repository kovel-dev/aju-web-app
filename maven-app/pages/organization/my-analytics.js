import { useEffect, useState } from 'react'
import {
  AddOns,
  Card,
  Footer,
  Heading,
  Layout,
  MailingList,
  Navbar,
  Typography,
  Tabs,
} from '@components'
import { getErrorMessage, hasError } from 'lib/validations/validations'
import { getSession } from 'next-auth/client'
import { server } from 'lib/config/server'
import addOnsData from '../../constants/addOnsData.json'
import Loader from '@components/loader'
import Page from 'lib/models/pages'

const tabList = ['My Users', 'My Add-Ons']

export async function getServerSideProps(context) {
  // session
  const session = await getSession({ req: context.req })

  // if role is not partner redirect to partner dashboard
  if (!session) {
    return {
      redirect: {
        // eslint-disable-next-line no-undef
        destination: `${server}/login`,
        permanent: false,
      },
    }
  }

  if (session.user.role !== 'partner') {
    return {
      redirect: {
        // eslint-disable-next-line no-undef
        destination: `${server}/individual/dashboard`,
        permanent: false,
      },
    }
  }

  return {
    // set session and token
    props: { session },
  }
}

const MyAnalytics = () => {
  const [activeTab, setActiveTab] = useState(0)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [
    totalCountOfUsersAffiliatedWithMyOrg,
    setTotalCountOfUsersAffiliatedWithMyOrg,
  ] = useState(0)
  const [
    totalCountOfNewUserSignUpsInThePast30Days,
    setTotalCountOfNewUserSignUpsInThePast30Days,
  ] = useState(0)
  const [
    totalCountOfUserPurchasesInThePast30Days,
    setTotalCountOfUserPurchasesInThePast30Days,
  ] = useState(0)
  const [topClassesAndEventItems, setTopClassesAndEventItems] = useState([])
  const [listOfProgramSponsored, setListOfProgramSponsored] = useState({
    title: 'Classes and events I have sponsored',
    items: [],
  })
  const [listOfProgramPurchasedInFull, setListOfProgramPurchasedInFull] =
    useState({
      title: 'Classes and events I have purchased in full',
      items: [],
    })
  const [listOfProgramReservedSeats, setListOfProgramReservedSeats] = useState({
    title: 'Classes and Events I have purchased a set amount of seats for',
    items: [],
  })

  useEffect(async () => {
    try {
      await Page.getPartnerAnalyticUserTabDetails().then((result) => {
        let {
          totalNumberOfUsersAffiliatedWithMyOrg,
          totalNumberOfNewUserSignUpsInThePast30Days,
          totalNumberOfUserPurchasesInThePast30Days,
          topClassesAndEvents,
        } = result.data

        setTotalCountOfUsersAffiliatedWithMyOrg(
          totalNumberOfUsersAffiliatedWithMyOrg
        )

        setTotalCountOfNewUserSignUpsInThePast30Days(
          totalNumberOfNewUserSignUpsInThePast30Days
        )

        setTotalCountOfUserPurchasesInThePast30Days(
          totalNumberOfUserPurchasesInThePast30Days
        )

        setTopClassesAndEventItems(topClassesAndEvents)
        setIsLoading(false)
      })
    } catch (error) {
      setErrors(error)
      setIsLoading(false)
    }
  }, [])

  useEffect(async () => {
    if (activeTab == 1) {
      setIsLoading(true)
      try {
        await Page.getPartnerAnalyticAddOnTabDetails().then((result) => {
          let { programPurchasedInFull, programSponsored, programReserved } =
            result.data

          setListOfProgramPurchasedInFull(programPurchasedInFull)
          setListOfProgramSponsored(programSponsored)
          setListOfProgramReservedSeats(programReserved)
          setIsLoading(false)
        })
      } catch (error) {
        setErrors(error)
        setIsLoading(false)
      }
    }
  }, [activeTab])

  return (
    <div className="min-h-fullpage">
      <header className="w-full">
        <Navbar />
      </header>
      <main>
        <div className="sm:pb-14 sm:pt-4 py-2">
          <Heading heading="My Analytics" />
        </div>
        <Tabs tabs={tabList} updateTabProp={setActiveTab} />
        {isLoading && (
          <div className="justify-center mx-auto max-w-wrapper mt-5 mb-5">
            <Loader />
          </div>
        )}
        {!isLoading && hasError(errors, 'general') && (
          <div className="justify-center mx-auto max-w-wrapper mt-5 mb-5">
            <p className="text-center text-red-600">
              {getErrorMessage(errors, 'general')}
            </p>
          </div>
        )}
        {!isLoading && (
          <>
            <div className="py-7 lg:py-16">
              {activeTab === 0 && (
                <Layout>
                  <div className="block mb-20 lg:flex lg:mb-28 lg:space-x-12 space-y-12 lg:space-y-0">
                    <Card className="px-0 text-center lg:mb-0 mb-7 lg:px-6 lg:w-1/3 py-14">
                      <Typography variant="title">
                        TOTAL NUMBER OF USERS AFFILIATED WITH MY ORGANIZATION
                      </Typography>
                      <Typography
                        color="text-blue-850"
                        className="mb-4 mt-4 text-5xl"
                      >
                        {totalCountOfUsersAffiliatedWithMyOrg}
                      </Typography>
                    </Card>
                    <Card className="px-0 text-center lg:mb-0 mb-7 lg:px-6 lg:w-1/3 py-14">
                      <Typography variant="title">
                        TOTAL NUMBER OF NEW USER SIGN-UPS IN THE PAST 30 DAYS
                      </Typography>
                      <Typography
                        color="text-blue-850"
                        className="mb-4 mt-4 text-5xl"
                      >
                        {totalCountOfNewUserSignUpsInThePast30Days}
                      </Typography>
                    </Card>
                    <Card className="px-0 text-center lg:mb-0 mb-7 lg:px-6 lg:w-1/3 py-14">
                      <Typography variant="title">
                        TOTAL NUMBER OF USER PURCHASES IN THE PAST 30 DAYS
                      </Typography>
                      <Typography
                        color="text-blue-850"
                        className="mb-4 mt-4 text-5xl"
                      >
                        {totalCountOfUserPurchasesInThePast30Days}
                      </Typography>
                    </Card>
                  </div>

                  <Typography
                    variant="subheading-2"
                    className="text-center mb-8 sm:mb-11 lg:mb-12"
                  >
                    Top classes and events users signed up for
                  </Typography>

                  <div className="block lg:flex lg:space-x-12 space-y-8 lg:space-y-0">
                    {topClassesAndEventItems.length <= 0 && (
                      <div className="justify-center mx-auto max-w-wrapper mt-5 mb-5">
                        <p className="text-center text-blue-850">
                          No Record(s) Found.
                        </p>
                      </div>
                    )}
                    {topClassesAndEventItems.map((item, index) => {
                      return (
                        <Card
                          className="px-6 py-20 text-center lg:w-1/3 lg:mb-0 mb-7"
                          key={index}
                        >
                          <Typography variant="subheading" className="mb-10">
                            {item[0]}
                          </Typography>
                          <Typography
                            color="text-blue-850"
                            className="mb-4 text-5xl"
                          >
                            {item[1]}
                          </Typography>
                          <Typography color="text-blue-850">
                            OF USERS
                          </Typography>
                        </Card>
                      )
                    })}
                  </div>
                </Layout>
              )}
              {activeTab === 1 && (
                <Layout className="lg:px-24 mt-8 sm:mt-10 lg:mt-0">
                  <AddOns
                    className="mb-8"
                    title={listOfProgramPurchasedInFull.title}
                    items={listOfProgramPurchasedInFull.items}
                    key={1}
                  />
                  <AddOns
                    className="mb-8"
                    title={listOfProgramSponsored.title}
                    items={listOfProgramSponsored.items}
                    key={2}
                  />
                  <AddOns
                    className="mb-8"
                    title={listOfProgramReservedSeats.title}
                    items={listOfProgramReservedSeats.items}
                    key={3}
                  />
                </Layout>
              )}
            </div>
          </>
        )}
      </main>
      <MailingList />
      <Footer />
    </div>
  )
}

export default MyAnalytics
