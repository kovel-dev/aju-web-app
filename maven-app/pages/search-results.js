import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Heading from '../components/heading'
import Footer from '../components/footer'
import MailingList from '../components/mailingList'
import Navbar from '../components/navbar'
import CardContainer from '../components/blocks/cardContainer'
import Pagination from '../components/pagination'
import classMockData from '../constants/classMockData'
import Loader from '@components/loader'
import Search from 'lib/models/search'
import Meta from '@components/meta'
import meta from 'constants/meta'
import moment from 'moment'

function SearchResultPage() {
  const [isLoading, setIsLoading] = useState(true)

  // variable to hold the current page number
  const [activePage, setActivePage] = useState(0)
  // variable to hold the total page count
  const [totalPages, setTotalPages] = useState(1)
  // variable to hold the data/result
  const [itemsShown, setItemsShown] = useState([])
  // variable to hold the limit
  const [itemsPerPage, setItemsPerPage] = useState(6)

  const [hasError, setHasError] = useState(false)

  const [keyword, setKeyword] = useState('')

  const [resultCount, setResultCount] = useState(0)

  const router = useRouter()

  useEffect(async () => {
    if (router.isReady) {
      if (router.query.search) {
        setKeyword(router.query.search)
        if (router.query.page) {
          setActivePage(router.query.page)
        } else {
          setActivePage(1)
        }
      } else {
        console.log({ key: 'general', values: 'Missing search parameter' })
        setHasError(true)
        setIsLoading(false)
      }
    }
  }, [router])

  useEffect(async () => {
    if (router.query.search) {
      await getData(router.query.search, activePage, itemsPerPage)
    }
  }, [activePage])

  const getData = async (keyword, currentPage, limit) => {
    try {
      await Search.searchByKeyword(keyword, currentPage, limit).then(
        (response) => {
          let { result, pageCount, resultCount } = response.data

          setResultCount(resultCount)

          setItemsShown(formatData(result))
          setTotalPages(pageCount)
          setIsLoading(false)
        }
      )
    } catch (error) {
      console.log(error)
      setHasError(true)
      setIsLoading(false)
    }
  }

  const formatData = (result) => {
    let formatRes = result.map((item, index) => {
      return {
        label: 'Select',
        img: item[40]
          ? item[40]
          : `${process.env.NEXT_PUBLIC_APP_URL}/images/class-default.jpg`,
        link: '/events-classes/program/' + item[10],
        title: item[0],
        description: item[12],

        month: moment(item[5]).format('MMM'),
        day: moment(item[5]).format('DD'),
        millisecondStartDt: item[14],
        free: parseInt(item[18]) < 1 ? true : false,
      }
    })

    return formatRes
  }

  const updatePage = (newPage) => {
    setIsLoading(true)
    router.push(
      '/search-results?search=' + router.query.search + '&page=' + newPage
    )
  }

  return (
    <div className="min-h-fullpage">
      <Meta
        title={meta.filterSearch.title}
        keywords={meta.filterSearch.keywords}
        description={meta.filterSearch.description}
      />
      <header className="w-full">
        <Navbar />
      </header>
      <main>
        {isLoading && <Loader />}
        {!isLoading && hasError && (
          <div className="w-full my-10">
            <div className="justify-center mx-auto max-w-wrapper">
              <p className="text-center text-red-600">
                Ops! Sorry something went wrong getting the result.
              </p>
            </div>
          </div>
        )}
        {itemsShown.length == 0 && !isLoading && !hasError && (
          <div className="w-full my-10">
            <div className="justify-center mx-auto max-w-wrapper">
              <p className="text-center">No Results Found.</p>
            </div>
          </div>
        )}
        {itemsShown.length > 0 && !isLoading && !hasError && (
          <>
            <Heading
              heading={`Search Results for "${keyword}" (${resultCount} found)`}
            />
            <CardContainer schema={itemsShown} />
            <Pagination
              pages={Array.from(Array(totalPages + 1).keys()).slice(1)}
              activePage={activePage}
              updatePageProp={updatePage}
            />
          </>
        )}
      </main>
      <MailingList />
      <Footer />
    </div>
  )
}

export default SearchResultPage
