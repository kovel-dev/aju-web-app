import { useState } from 'react'
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
import addOnsData from '../constants/addOnsData.json'

const tabList = ['My Users', 'My Schedule']
// const breadcrumbs = [
//   { label: 'Home', link: '/' },
//   { label: 'My Analytics', link: '/analytics' },
// ]

const MyAnalytics = () => {
  const [activeTab, setActiveTab] = useState(0)

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
        <div className="py-7 lg:py-16">
          {activeTab === 0 && (
            <Layout>
              <div className="block mb-20 lg:flex lg:mb-28 lg:space-x-12 space-y-12 lg:space-y-0">
                <Card className="px-0 text-center lg:mb-0 mb-7 lg:px-6 lg:w-1/3 py-14">
                  <Typography variant="title">
                    TOTAL NUMBER OF USERS AFFILIATED WITH MY ORGANIZATION
                  </Typography>
                </Card>
                <Card className="px-0 text-center lg:mb-0 mb-7 lg:px-6 lg:w-1/3 py-14">
                  <Typography variant="title">
                    TOTAL NUMBER OF NEW USER SIGN-UPS IN THE PAST 30 DAYS
                  </Typography>
                </Card>
                <Card className="px-0 text-center lg:mb-0 mb-7 lg:px-6 lg:w-1/3 py-14">
                  <Typography variant="title">
                    TOTAL NUMBER OF USER PURCHASES IN THE PAST 30 DAYS
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
                <Card className="px-6 py-20 text-center lg:w-1/3 lg:mb-0 mb-7">
                  <Typography variant="subheading" className="mb-10">
                    PROGRAM NAME
                  </Typography>
                  <Typography color="text-blue-850" className="mb-4 text-5xl">
                    #
                  </Typography>
                  <Typography color="text-blue-850">OF USERS</Typography>
                </Card>
                <Card className="px-6 py-20 text-center lg:w-1/3 lg:mb-0 mb-7">
                  <Typography variant="subheading" className="mb-10">
                    PROGRAM NAME
                  </Typography>
                  <Typography color="text-blue-850" className="mb-4 text-5xl">
                    #
                  </Typography>
                  <Typography color="text-blue-850">OF USERS</Typography>
                </Card>
                <Card className="px-6 py-20 text-center lg:w-1/3 lg:mb-0 mb-7">
                  <Typography variant="subheading" className="mb-10">
                    PROGRAM NAME
                  </Typography>
                  <Typography color="text-blue-850" className="mb-4 text-5xl">
                    #
                  </Typography>
                  <Typography color="text-blue-850">OF USERS</Typography>
                </Card>
              </div>
            </Layout>
          )}
          {activeTab === 1 && (
            <Layout className="lg:px-24 mt-8 sm:mt-10 lg:mt-0">
              {addOnsData.map((addOns, addOnsIndex) => (
                <AddOns
                  className="mb-8"
                  title={addOns.title}
                  items={addOns.items}
                  key={addOnsIndex}
                />
              ))}
            </Layout>
          )}
        </div>
      </main>
      <MailingList />
      <Footer />
    </div>
  )
}

export default MyAnalytics
