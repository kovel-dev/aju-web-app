/* eslint-disable */
import { useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Heading from '../../components/heading'
import Footer from '../../components/footer'
import MailingList from '../../components/mailingList'
import Subheading from '../../components/subheading'
import Navbar from '../../components/navbar'
import CardContainer from '../../components/blocks/cardContainer'
import Button from '../../components/form/button'
import SearchBar from '../../components/search/searchBar'
import SelectInput from '../../components/form/selectInput'
import LearnMore from '../../components/callout/learnMore'
import Pagination from '../../components/pagination'
import collectionData from '../../constants/collectionData'
import eventMockData from '../../constants/eventMockData'
import filterData from '../../constants/filterData'
import Product from 'lib/models/product'
import Loading from '../../components/loading'
import Card from '@components/card'
import Typography from '@components/typography'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  getPageData,
  getFeaturedPrograms,
  getFeaturedTags,
  getActiveHosts,
  getActiveTags,
} from '../../lib/handlers/fauna-function-handlers'
import { Meta } from 'components'
import meta from 'constants/meta'

export async function getServerSideProps() {
  //Fetch Initial Values from db
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

  const featuredClasses = await getFeaturedPrograms('class-series', 6)

  //Get Featured On-Demand Programs
  const featuredEvents = await getFeaturedPrograms('event', 3)
  const hosts = await getActiveHosts()
  const tags = await getActiveTags()

  return {
    props: {
      pageData,
      featuredTags,
      featuredClasses,
      featuredEvents,
      hosts,
      tags,
    }, // will be passed to the page component as props
  }
}

const EventsClasses = ({
  featuredClasses,
  featuredEvents,
  pageData,
  featuredTags,
  hosts,
  tags,
}) => {
  const [userInput, setUserInput] = useState('')
  const [filter, setFilter] = useState({})
  const [submitSearch, setSubmitSearch] = useState(false)
  const [activePage, setActivePage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [itemsShown, setItemsShown] = useState([])
  const [itemsPerPage, setItemsPerPage] = useState(6)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStr, setFilterStr] = useState('')

  const router = useRouter()

  const learningArr = [
    {
      label: 'Select',
      img: 'https://images.unsplash.com/photo-1564832586408-3b10f4f41541?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1190&q=80',
      link: '/events-classes/product/product1',
      title: 'First Page Here',
      description: 'Hey my name is Alissa CHenljfalskfjklasj dfkajlfsdj.',
    },
    {
      label: 'Select',
      img: 'https://images.unsplash.com/photo-1564832586408-3b10f4f41541?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1190&q=80',
      link: '/events-classes/product/product2',
      title: 'Sed Ut Perspicisaf',
      description: 'Hey my name is Alissa CHenljfalskfjklasj dfkajlfsdj.',
    },
    {
      label: 'Select',
      img: 'https://images.unsplash.com/photo-1564832586408-3b10f4f41541?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1190&q=80',
      link: '/events-classes/product/event2',
      title: 'Sed Ut Perspicisaf',
      description: 'Hey my name is Alissa CHenljfalskfjklasj dfkajlfsdj.',
    },
    {
      label: 'Select',
      img: 'https://images.unsplash.com/photo-1564832586408-3b10f4f41541?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1190&q=80',
      link: '/events-classes/product/event2',
      title: 'Sed Ut Perspicisaf',
      description: 'Hey my name is Alissa CHenljfalskfjklasj dfkajlfsdj.',
    },
    {
      label: 'Select',
      img: 'https://images.unsplash.com/photo-1564832586408-3b10f4f41541?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1190&q=80',
      link: '/events-classes/product/event2',
      title: 'Sed Ut Perspicisaf',
      description: 'Hey my name is Alissa CHenljfalskfjklasj dfkajlfsdj.',
    },
    {
      label: 'Select',
      img: 'https://images.unsplash.com/photo-1564832586408-3b10f4f41541?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1190&q=80',
      link: '/events-classes/product/event2',
      title: 'Sed Ut Perspicisaf',
      description: 'Hey my name is Alissa CHenljfalskfjklasj dfkajlfsdj.',
    },
  ]

  const doMore = [
    {
      title: 'Book an AJU Team Member for a Private Event',
      link: '/events-classes/book-speaker',
    },
    {
      title: 'Support Maven and sponsor a class or event',
      link: '/donate',
    },
  ]

  useEffect(() => {
    let newFilterStr = '/events-classes/filter?'
    if (filter) {
      for (const key in filter) {
        const parseItem = filter[key].toLowerCase().split(' ').join('_')
        newFilterStr += key + '=' + parseItem + '&'
      }
    }

    setFilterStr(newFilterStr.slice(0, -1))
  }, [filter])

  const updateFilter = async (e) => {
    e.preventDefault()
    router.push(filterStr)
  }

  return (
    <div className="min-h-fullpage">
      <Meta
        title={meta.eventsAndClasses.title}
        keywords={meta.eventsAndClasses.keywords}
        description={meta.eventsAndClasses.description}
      />
      <header className="w-full">
        <Navbar />
      </header>
      <main>
        <div
          className={`${!submitSearch ? 'sm:block hidden' : '-mb-10 lg:-mb-8'}`}
        >
          <Heading
            heading="Events & Classes"
            breadcrumbs={[
              {
                link: '/',
                label: 'Home',
              },
              {
                link: '/events-classes',
                label: 'Events & Classes',
              },
            ]}
          />
        </div>
        {!submitSearch && (
          <div className="-mb-5 overflow-hidden sm:mb-12 sm:mt-6 max-h-banner">
            <img
              src="/images/classes_events.jpg"
              alt="Class and events banner image"
              className="w-full h-full help-banner object-cover max-w-full max-h-banner object-left"
            />
          </div>
        )}
        <Subheading
          content="Not sure where to start?"
          secondRow="Use filters to narrow your search."
        />
        <div className="px-5 mx-auto -mt-4 max-w-form md:px-0 sm:-mt-5">
          <SearchBar
            placeholder="What topics and speakers are you interested in?"
            page="true"
            submitSearchProp={updateFilter}
            updateUserInputProp={(newUserInput) => {
              setUserInput(newUserInput)
              if (newUserInput.length > 0) {
                const newFilter = { ...filter }
                newFilter['searchText'] = newUserInput
                setFilter(newFilter)
              }
            }}
          />
        </div>
        <div className="grid grid-cols-1 gap-5 px-5 mx-auto my-10 max-w-wrapper sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {tags && (
            <SelectInput
              label="Topic"
              id="topic"
              name="tagRef"
              options={tags}
              value={filter['tagRef'] ? filter['tagRef'] : ''}
              onChange={(e) => {
                const newFilter = { ...filter }
                newFilter['tagRef'] = e.target.value
                setFilter(newFilter)
              }}
              placeholder="Select"
              width=""
              error=""
              blueLabel={true}
              key="topic"
            />
          )}
          {filterData.map((item) => {
            return (
              <SelectInput
                label={item.label}
                id={item.id}
                name={item.name}
                options={item.options}
                value={filter[item.name] ? filter[item.name] : ''}
                onChange={(e) => {
                  const newFilter = { ...filter }
                  newFilter[item.name] = e.target.value
                  setFilter(newFilter)
                }}
                placeholder="Select"
                width=""
                error=""
                blueLabel={true}
                key={item.id}
              />
            )
          })}
          {hosts && (
            <SelectInput
              label="Instructor"
              id="instructor"
              name="hostRef"
              options={hosts}
              value={filter['hostRef'] ? filter['hostRef'] : ''}
              onChange={(e) => {
                const newFilter = { ...filter }
                newFilter['hostRef'] = e.target.value
                setFilter(newFilter)
              }}
              placeholder="Select"
              width=""
              error=""
              blueLabel={true}
              key="instructor"
            />
          )}
        </div>
        <div className="flex items-center justify-center w-full my-10 sm:my-12">
          <Button
            type="button"
            buttonContent="Filter my choices"
            action={updateFilter}
          />
        </div>
        {submitSearch ? (
          <>
            <div className="hidden sm:block">
              <Subheading
                content={`You searched for “${searchTerm}” (${
                  learningArr.length
                } ${learningArr.length > 1 ? 'results' : 'result'})`}
              />
            </div>
            <div className="sm:hidden">
              <Subheading
                content={`You searched for`}
                secondRow={`“${searchTerm}” (${learningArr.length} ${
                  learningArr.length > 1 ? 'results' : 'result'
                })`}
              />
            </div>
            <CardContainer schema={itemsShown} />
            <Pagination
              pages={Array.from(Array(totalPages + 1).keys()).slice(1)}
              activePage={activePage}
              updatePageProp={updatePage}
            />
          </>
        ) : (
          <>
            <Subheading content="Browse our Collection by Topic" />
            <CardContainer schema={featuredTags} />
            <Subheading content="Featured Classes" />
            <CardContainer schema={featuredClasses} />
            <div className="flex items-center justify-center w-full my-10 sm:my-12">
              <Button
                type="button"
                buttonContent="View all Classes"
                action={() => router.push('/events-classes/all-classes')}
              />
            </div>
            <Subheading content="Featured Events" />
            <CardContainer schema={featuredEvents} />
            <div className="flex items-center justify-center w-full my-10 sm:my-12">
              <Button
                type="button"
                buttonContent="View all Events"
                action={() => router.push('/events-classes/all-events')}
              />
            </div>
            {/* <div className="mt-16 mb-10 sm:my-12">
            <LearnMore
              btnContent="Learn More"
              title="Book an AJU speaker for a private event"
              ctaLink="/events-classes/book-speaker"
              // description="Nemo enin ipas slfa lsjf qui vopufela sit apsepr  aut oid ia f, sdfjl sf."
            />
            <LearnMore
              btnContent="Learn More"
              title="Support Maven and sponsor a class or event"
              // description="Nemo enin ipas slfa lsjf qui vopufela sit apsepr  aut oid ia f, sdfjl sf."
              ctaLink="/donate"
            />
          </div> */}
            <div className="block px-5 mx-auto lg:flex mb-14 lg:space-x-12 max-w-wrapper">
              {doMore.map((value, valueIndex) => (
                <Card
                  className="px-6 pt-10 pb-16 mb-6 lg:mb-0 lg:w-1/2"
                  key={valueIndex}
                >
                  <Typography variant="subheading-2" className="mb-6 uppercase">
                    {value.title}
                  </Typography>
                  <Typography className="mb-7">{value.description}</Typography>
                  <a
                    onClick={
                      !value.link
                        ? () => {
                            setPartnerForm(true)
                            window.scrollTo(0, 30)
                          }
                        : () => {}
                    }
                    href={value.link ? value.link : ''}
                  >
                    <Typography className="underline">Learn More</Typography>
                  </a>
                </Card>
              ))}
            </div>
          </>
        )}
      </main>
      <MailingList />
      <Footer />
    </div>
  )
}

export default EventsClasses
