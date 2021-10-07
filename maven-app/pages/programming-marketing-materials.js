import { useState } from 'react'

import {
  Button,
  Footer,
  Heading,
  Layout,
  MailingList,
  MarketingMaterialCard,
  Navbar,
  SearchBar,
  Typography,
  Tabs,
} from '@components'

import SelectInput from '@components/form/selectInput'

import marketingMaterialData from '../constants/marketingMaterialData.json'
import ScheduleSelector from '@components/scheduleSelector'
import ProgramContainer from '@components/blocks/programContainer'

const tabList = ['Early Access Programming', 'Marketing Materials']
// const breadcrumbs = [
//   { label: 'Home', link: '/home' },
//   { label: 'My Schedule', link: '/schedule' },
// ]

const MyScheduleMarketingMaterials = () => {
  const [activeTab, setActiveTab] = useState(0)
  const [schedFrom, setSchedFrom] = useState('')
  const [schedTo, setSchedTo] = useState('')
  const [mmDate, setMMDate] = useState('')
  const [mmTopic, setMMTopic] = useState('')
  const [searchInput, setSearchInput] = useState('')

  return (
    <div className="min-h-fullpage">
      <header className="w-full">
        <Navbar />
      </header>
      <main>
        <div className="mx-auto mb-0 lg:mb-28 lg:mt-12 sm:mb-8 md:max-w-full sm:max-w-success max-w-tile">
          <Heading heading="Early Access Programming and Marketing Material" />
        </div>
        <Tabs tabs={tabList} updateTabProp={setActiveTab} />
        <div className="py-8">
          {activeTab === 0 && (
            <Layout>
              <ScheduleSelector
                schedFromProp={(newFrom) => {
                  setSchedFrom(newFrom)
                }}
                schedToProp={(newTo) => {
                  setSchedTo(newTo)
                }}
              />
              <Typography
                variant="subheading-2"
                className="mb-2 text-center lg:mb-12 lg:pt-4"
              >
                Upcoming Programs
              </Typography>
              <ProgramContainer
                programs={[
                  {
                    name: 'Program Name',
                    date: 'Jan 11',
                    time: '4 pm',
                    link: '/my-account/event1',
                  },
                  {
                    name: 'Program Name',
                    date: 'Jan 11',
                    time: '4 pm',
                    link: '/my-account/event1',
                  },
                  {
                    name: 'Program Name',
                    date: 'Jan 11',
                    time: '4 pm',
                    link: '/my-account/event1',
                  },
                ]}
              />
            </Layout>
          )}
          {activeTab === 1 && (
            <Layout>
              <div className="mx-0 lg:mx-64 lg:mb-20 mb-9 mt-4">
                <SearchBar
                  placeholder="Search"
                  variant="outline"
                  updateUserInputProp={(newInput) => {
                    setSearchInput(newInput)
                  }}
                  submitSearchProp={() => {}}
                />
              </div>
              <div className="flex flex-col items-center justify-between space-y-4 mb-14 lg:mb-20 lg:flex-row lg:space-y-0">
                <Typography color="text-blue-850" className="text-lg font-bold">
                  Sort by
                </Typography>
                <div className="w-full lg:w-1/3 sm:w-1/2">
                  <SelectInput
                    label=""
                    id="marketing-material-date"
                    name="marketing_material_date"
                    options={[
                      { key: '30', value: 'today' },
                      { key: '20', value: 'tomorrow' },
                    ]}
                    value={mmDate ? mmDate : ''}
                    onChange={(e) => {
                      const newDate = e.target.value
                      setMMDate(newDate)
                    }}
                    placeholder="Date"
                    width="full"
                    error=""
                    blueLabel={false}
                  />
                </div>
                <div className="w-full lg:w-1/3 sm:w-1/2">
                  <SelectInput
                    label=""
                    id="material-market-topic"
                    name="material_market_topic"
                    options={[
                      { key: '30', value: 'Topic 1' },
                      { key: '20', value: 'Topic 2' },
                    ]}
                    value={mmTopic ? mmTopic : ''}
                    onChange={(e) => {
                      const newTopic = e.target.value
                      setMMTopic(newTopic)
                    }}
                    placeholder="Topic"
                    width="full"
                    error=""
                    blueLabel={false}
                  />
                </div>
                <div className="pt-2 lg:pt-0">
                  <Button
                    type="button"
                    buttonContent="Sort Choices"
                    action={() => {}}
                  />
                </div>
              </div>
              <div className="lg:mx-32">
                {marketingMaterialData.map((item, itemIndex) => (
                  <MarketingMaterialCard
                    item={item}
                    className="lg:mb-12 mb-9"
                    key={itemIndex}
                  />
                ))}
              </div>
            </Layout>
          )}
        </div>
      </main>
      <MailingList />
      <Footer />
    </div>
  )
}

export default MyScheduleMarketingMaterials
