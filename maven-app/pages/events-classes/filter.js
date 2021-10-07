import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Heading from '../../components/heading'
import Footer from '../../components/footer'
import MailingList from '../../components/mailingList'
import Navbar from '../../components/navbar'
import CardContainer from '../../components/blocks/cardContainer'
import Pagination from '../../components/pagination'
import classMockData from '../../constants/classMockData'
import Product from 'lib/models/product'
import Loading from '../../components/loading'
import AccordionFilterElement from '../../components/accordion/accordionFilterElement'
import Meta from '@components/meta'
import meta from 'constants/meta'

const Filter = () => {
  const [activePage, setActivePage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [itemsShown, setItemsShown] = useState([])
  const [itemsPerPage, setItemsPerPage] = useState(6)
  const [classState, setClassState] = useState([])
  // variable to toggle loading gif
  const [isLoading, setIsLoading] = useState(true)
  // variable to toggle error message
  const [hasError, setHasError] = useState(false)

  const router = useRouter()
  let product = new Product()

  useEffect(async () => {
    setIsLoading(true)
    if (router.isReady) {
      //add fauna funcation here

      await product
        .getAllProductsbyFilter(router.query)
        .then((response) => {
          if (response.data.length === 0) {
            setIsLoading(false)
          } else {
            setClassState(response.data.results)
            setIsLoading(false)
          }
        })
        .catch((error) => {
          console.log(error)
          setHasError(true)
          setIsLoading(false)
        })
    }
  }, [router])

  useEffect(() => {
    const newItemsShown = classState.slice(0, itemsPerPage)
    setItemsShown(newItemsShown)

    const newTotalPages = Math.ceil(classState.length / itemsPerPage)
    setTotalPages(newTotalPages)
  }, [classState])

  const updatePage = (newPage) => {
    setActivePage(newPage)
    //post request??

    const newItemsShown = classState.slice(
      itemsPerPage * (newPage - 1),
      itemsPerPage * newPage
    )
    setItemsShown(newItemsShown)
  }

  return (
    <div className="min-h-fullpage">
      <Meta
        title={meta.filterEvent.title}
        keywords={meta.filterEvent.keywords}
        description={meta.filterEvent.description}
      />
      <header className="w-full">
        <Navbar />
      </header>
      <main>
        <Heading
          heading="Filter Events & Classes"
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
        {isLoading && <Loading />}

        {!isLoading && hasError && (
          <div className="justify-center mx-auto max-w-wrapper">
            <p className="text-center text-red-600">
              Sorry! Something went wrong getting the results.
            </p>
          </div>
        )}

        {!isLoading && itemsShown.length > 0 && !hasError && (
          <>
            <CardContainer schema={itemsShown} />
            <Pagination
              pages={Array.from(Array(totalPages + 1).keys()).slice(1)}
              activePage={activePage}
              updatePageProp={updatePage}
            />
          </>
        )}

        {!isLoading && itemsShown.length <= 0 && !hasError && (
          <div className="justify-center mx-auto max-w-wrapper mb-10">
            <p className="text-center text-blue-850">No Result(s) Found.</p>
          </div>
        )}
      </main>
      <MailingList />
      <Footer />
    </div>
  )
}

export default Filter
