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
import Pagination from '../../components/pagination'
import { useRouter } from 'next/router'
import {
  getPageData,
  getFeaturedPrograms,
  getFeaturedTags,
  getActiveHosts,
  getActiveTags,
} from '../../lib/handlers/fauna-function-handlers'
import Organization from '../../lib/models/organization'
import { Meta } from '../../components'
import meta from '../../constants/meta'
import ProgramPaginationContainer from '@components/blocks/program-pagination-container'

export async function getServerSideProps() {
  //Fetch Initial Values from db
  let pageData = await getPageData('home')
  let featuredTags = {}
  let featuredTagsRefIDs = {}
  let organization = new Organization({})
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
  const organizations = await organization.getOrganizationForSelect(1, 100000)
  const hosts = await getActiveHosts()
  const tags = await getActiveTags()

  return {
    props: {
      pageData,
      featuredTags,
      featuredClasses,
      featuredEvents,
      organizations,
      hosts,
      tags,
    }, // will be passed to the page component as props
  }
}

const OnDemand = ({
  featuredClasses,
  featuredEvents,
  pageData,
  featuredTags,
  organizations,
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
      label: 'Hebrew',
      img: 'https://images.unsplash.com/photo-1564832586408-3b10f4f41541?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1190&q=80',
      link: '/hebrew',
    },
    {
      label: 'Jewish',
      img: 'https://images.unsplash.com/photo-1564832586408-3b10f4f41541?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1190&q=80',
      link: '/hebrew',
    },
    {
      label: 'Art and Art History',
      img: 'https://images.unsplash.com/photo-1564832586408-3b10f4f41541?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1190&q=80',
      link: '/hebrew',
    },
    {
      label: 'Hebrew',
      img: 'https://images.unsplash.com/photo-1564832586408-3b10f4f41541?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1190&q=80',
      link: '/hebrew',
    },
    {
      label: 'Current Affairs',
      img: 'https://images.unsplash.com/photo-1564832586408-3b10f4f41541?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1190&q=80',
      link: '/hebrew',
    },
    {
      label: 'Culture and Media',
      img: 'https://images.unsplash.com/photo-1564832586408-3b10f4f41541?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1190&q=80',
      link: '/hebrew',
    },
  ]

  useEffect(() => {
    let newFilterStr = '/on-demand/filter?type=on-demand&'
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
        title={meta.onDemand.title}
        keywords={meta.onDemand.keywords}
        description={meta.onDemand.description}
      />
      <header className="w-full">
        <Navbar />
      </header>
      <main>
        <div
          className={`${!submitSearch ? 'sm:block hidden' : '-mb-10 lg:-mb-8'}`}
        >
          <Heading
            heading="On Demand Library"
            breadcrumbs={[
              {
                link: '/',
                label: 'Home',
              },
              {
                link: '/on-demand',
                label: 'On Demand',
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
            placeholder="What topics and subjects are you interested in?"
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
          {/* {filterData.map((item) => {
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
          })} */}
          {organizations && (
            <SelectInput
              label="Sponsor Name"
              id="sponsorRef"
              name="sponsorRef"
              options={organizations}
              value={filter['sponsorRef'] ? filter['sponsorRef'] : ''}
              onChange={(e) => {
                const newFilter = { ...filter }
                newFilter['sponsorRef'] = e.target.value
                setFilter(newFilter)
              }}
              placeholder="Select"
              width=""
              error=""
              blueLabel={true}
              key="sponsorRef"
            />
          )}
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
        {/* On-Demand content in Paginated format */}
        <ProgramPaginationContainer programType="on-demand" title="On-Demand Library" />
      </main>
      <MailingList />
      <Footer />
    </div>
  )
}

export default OnDemand
