import { useEffect, useState } from 'react'
import {
  Footer,
  Heading,
  Layout,
  MailingList,
  Navbar,
  PurchaseHistoryCard,
  Tabs,
} from '@components'
import { getErrorMessage, hasError } from 'lib/validations/validations'
import { getSession } from 'next-auth/client'
import { server } from 'lib/config/server'
import ScheduleSelector from '@components/scheduleSelector'
import Page from 'lib/models/pages'
import Loader from '@components/loader'
import { Meta } from '../../components'
import meta from '../../constants/meta'

const tabList = ['Upcoming', 'Past']

export async function getServerSideProps(context) {
  // session
  const session = await getSession({ req: context.req })

  // if role is not student redirect to student dashboard
  if (!session) {
    return {
      redirect: {
        destination: `${server}/login`,
        permanent: false,
      },
    }
  }

  return {
    // set session and token
    props: { session },
  }
}

const PurchaseHistory = () => {
  const [activeTab, setActiveTab] = useState(0)
  const [schedFrom, setSchedFrom] = useState('')
  const [schedTo, setSchedTo] = useState('')
  const [tabState, setTabState] = useState('upcoming')

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [listPrograms, setListPrograms] = useState([])

  useEffect(async () => {
    if (activeTab == 0) {
      setTabState('past')
    } else {
      setTabState('upcoming')
    }

    getScheduleResult()
  }, [activeTab])

  const getScheduleResult = async () => {
    setListPrograms([])
    setIsLoading(true)
    try {
      await Page.getPurchaseHistory(schedFrom, schedTo, tabState).then(
        (result) => {
          let data = result.data
          setListPrograms(data)
          setIsLoading(false)
        }
      )
    } catch (error) {
      setErrors(error)
      setIsLoading(false)
    }
  }

  const dateButtonHandler = () => {
    getScheduleResult()
  }

  return (
    <div className="min-h-fullpage">
      <Meta
        title={meta.individualPurchase.title}
        keywords={meta.individualPurchase.keywords}
        description={meta.individualPurchase.description}
      />
      <header className="w-full">
        <Navbar />
      </header>
      <main className="lg:mt-4 mt-2">
        <Heading heading="My Purchase History" />
        <Layout className="lg:mt-12 sm:mt-4 mt-0">
          <ScheduleSelector
            purchaseHistory={true}
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
        </Layout>
        {!schedFrom && !schedTo && (
          <Tabs tabs={tabList} updateTabProp={setActiveTab} />
        )}
        <div className="py-8 px-5 max-w-list lg:max-w-wrapper mx-auto lg:mt-16 sm:mt-10 mt-2">
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
          {!isLoading && listPrograms.length <= 0 && (
            <div className="justify-center mx-auto max-w-wrapper mt-5 mb-5">
              <p className="text-center text-blue-850">No Record(s) Found.</p>
            </div>
          )}
          {listPrograms.length > 0 &&
            listPrograms.map((item, itemIndex) => (
              <PurchaseHistoryCard
                item={item}
                itemIndex={itemIndex}
                key={itemIndex}
              />
            ))}
        </div>
      </main>
      <MailingList />
      <Footer />
    </div>
  )
}

export default PurchaseHistory
