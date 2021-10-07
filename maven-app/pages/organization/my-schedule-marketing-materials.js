import { useEffect, useState } from 'react'
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
import { getErrorMessage, hasError } from 'lib/validations/validations'
import SelectInput from '@components/form/selectInput'
import ScheduleSelector from '@components/scheduleSelector'
import ProgramContainer from '@components/blocks/programContainer'
import Loader from '@components/loader'
import Page from 'lib/models/pages'
import ListMaterialPopup from '@components/popup/list-material'

const tabList = ['My Schedule', 'Marketing Materials']

const MyScheduleMarketingMaterials = () => {
  const [activeTab, setActiveTab] = useState(0)
  const [schedFrom, setSchedFrom] = useState('')
  const [schedTo, setSchedTo] = useState('')

  // fields for the marketing material
  const [mmDate, setMMDate] = useState('')
  const [mmTopic, setMMTopic] = useState('')
  const [searchInput, setSearchInput] = useState('')

  // miscellaneous
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [openPopup, setOpenPopup] = useState(false)
  const [listMaterial, setListMaterial] = useState([])
  const [listPrograms, setListPrograms] = useState([])

  useEffect(async () => {
    if (activeTab == 0) {
      getScheduleResult()
    } else {
      getMarketingMaterialResult()
    }
  }, [activeTab])

  const getMarketingMaterialResult = async () => {
    setListPrograms([])
    setIsLoading(true)
    try {
      await Page.getMarketingMaterials(searchInput, mmDate, mmTopic).then(
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

  const getScheduleResult = async () => {
    setListPrograms([])
    setIsLoading(true)
    try {
      await Page.getPartnerSchedules(schedFrom, schedTo).then((result) => {
        // [
        //   {
        //     name: 'Program Name',
        //     date: 'Jan 11',
        //     time: '4 pm',
        //     link: '/my-account/event1',
        //   },
        //   {
        //     name: 'Program Name',
        //     date: 'Jan 11',
        //     time: '4 pm',
        //     link: '/my-account/event1',
        //   },
        //   {
        //     name: 'Program Name',
        //     date: 'Jan 11',
        //     time: '4 pm',
        //     link: '/my-account/event1',
        //   },
        // ]
        let data = result.data
        setListPrograms(data)
        setIsLoading(false)
      })
    } catch (error) {
      setErrors(error)
      setIsLoading(false)
    }
  }

  const dateButtonHandler = () => {
    getScheduleResult()
  }

  const sortButtonHandler = () => {
    getMarketingMaterialResult()
  }

  const matertialButtonHandler = (productId) => {
    let program = listPrograms.filter((item) => {
      return item.id == productId
    })

    setListMaterial(program[0].materials)
    setOpenPopup(true)
  }

  return (
    <>
      <div className="min-h-fullpage">
        <header className="w-full">
          <Navbar />
        </header>
        <main>
          <div className="mx-auto mb-0 lg:mb-28 lg:mt-12 sm:mb-8 md:max-w-full sm:max-w-success max-w-tile">
            <Heading heading="My Schedule and Marketing Material" />
          </div>
          <Tabs tabs={tabList} updateTabProp={setActiveTab} />
          <div className="py-8">
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
            {activeTab === 0 && !isLoading && (
              <Layout>
                <ScheduleSelector
                  schedFromProp={(newFrom) => {
                    setSchedFrom(newFrom)
                  }}
                  schedToProp={(newTo) => {
                    setSchedTo(newTo)
                  }}
                  defaultFrom={schedFrom}
                  defaultTo={schedTo}
                  buttonAction={dateButtonHandler}
                />
                {schedFrom.length <= 0 && schedTo.length <= 0 && (
                  <Typography
                    variant="subheading-2"
                    className="mb-2 text-center lg:mb-12 lg:pt-4"
                  >
                    Upcoming Programs
                  </Typography>
                )}
                {!isLoading && listPrograms.length <= 0 && (
                  <div className="justify-center mx-auto max-w-wrapper mt-5 mb-5">
                    <p className="text-center text-blue-850">
                      No Record(s) Found.
                    </p>
                  </div>
                )}
                <ProgramContainer programs={listPrograms} />
              </Layout>
            )}
            {activeTab === 1 && (
              <Layout>
                {!isLoading && (
                  <>
                    <div className="mx-0 lg:mx-64 lg:mb-20 mb-9 mt-4">
                      <SearchBar
                        placeholder="Search"
                        variant="outline"
                        defaultValue={searchInput}
                        updateUserInputProp={(newInput) => {
                          setSearchInput(newInput)
                        }}
                        submitSearchProp={() => {
                          sortButtonHandler()
                        }}
                      />
                    </div>
                    <div className="flex flex-col items-center justify-between space-y-4 mb-14 lg:mb-20 lg:flex-row lg:space-y-0">
                      <Typography
                        color="text-blue-850"
                        className="text-lg font-bold"
                      >
                        Sort by
                      </Typography>
                      <div className="w-full lg:w-1/3 sm:w-1/2">
                        <SelectInput
                          label=""
                          id="marketing-material-date"
                          name="marketing_material_date"
                          options={[
                            { key: '', value: 'Date' },
                            { key: 'date_desc', value: 'Newest' },
                            { key: 'date_asc', value: 'Oldest' },
                          ]}
                          value={mmDate ? mmDate : ''}
                          onChange={(e) => {
                            const newDate = e.target.value
                            setMMDate(newDate)
                            setMMTopic('')
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
                            { key: '', value: 'Topic' },
                            { key: 'topic_asc', value: 'A-Z' },
                            { key: 'topic_desc', value: 'Z-A' },
                          ]}
                          value={mmTopic ? mmTopic : ''}
                          onChange={(e) => {
                            const newTopic = e.target.value
                            setMMTopic(newTopic)
                            setMMDate('')
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
                          action={() => {
                            sortButtonHandler()
                          }}
                        />
                      </div>
                    </div>
                    <div className="lg:mx-32">
                      {!isLoading && listPrograms.length <= 0 && (
                        <div className="justify-center mx-auto max-w-wrapper mt-5 mb-5">
                          <p className="text-center text-blue-850">
                            No Record(s) Found.
                          </p>
                        </div>
                      )}
                      {listPrograms.map((item, itemIndex) => (
                        <MarketingMaterialCard
                          item={item}
                          className="lg:mb-12 mb-9"
                          key={itemIndex}
                          onClickMaterialButton={matertialButtonHandler}
                        />
                      ))}
                    </div>
                  </>
                )}
              </Layout>
            )}
          </div>
        </main>
        <MailingList />
        <Footer />
      </div>
      {openPopup && (
        <ListMaterialPopup
          open={openPopup}
          items={listMaterial}
          closeProp={() => {
            setOpenPopup(false)
          }}
        />
      )}
    </>
  )
}

export default MyScheduleMarketingMaterials
