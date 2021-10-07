import { useState } from 'react'

import {
  Footer,
  Heading,
  Layout,
  MailingList,
  Navbar,
  PurchaseHistoryCard,
  Tabs,
} from '@components'

import purchaseHistoryData from '../constants/purchaseHistoryData.json'
import ScheduleSelector from '@components/scheduleSelector'

const tabList = ['Upcoming', 'Past']
// const breadcrumbs = [
//   { label: 'Home', link: '/' },
//   { label: 'My Purchase History', link: '/purchase-history' },
// ]

const PurchaseHistory = () => {
  const [activeTab, setActiveTab] = useState(0)
  const [schedFrom, setSchedFrom] = useState('')
  const [schedTo, setSchedTo] = useState('')

  const updateTab = (newTab) => {
    setActiveTab(newTab)
  }

  return (
    <div className="min-h-fullpage">
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
          />
        </Layout>
        <Tabs tabs={tabList} updateTabProp={updateTab} />
        <div className="py-8 px-5 max-w-list lg:max-w-wrapper mx-auto lg:mt-16 sm:mt-10 mt-2">
          {activeTab === 0 &&
            purchaseHistoryData.map((item, itemIndex) => (
              <PurchaseHistoryCard item={item} key={itemIndex} />
            ))}
        </div>
      </main>
      <MailingList />
      <Footer />
    </div>
  )
}

export default PurchaseHistory
