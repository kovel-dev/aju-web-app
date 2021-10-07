import { useState, useEffect } from 'react'
import { Richtext } from '../../components/partials'
import Head from 'next/head'
import Heading from '../../components/heading'
import Footer from '../../components/footer'
import MailingList from '../../components/mailingList'
import Subheading from '../../components/subheading'
import Navbar from '../../components/navbar'
import CardContainer from '../../components/blocks/cardContainer'
import Pagination from '../../components/pagination'
import classMockData from '../../constants/classMockData'
import { getTag } from '../../lib/handlers/fauna-function-handlers'
import Product from 'lib/models/product'
import {
  ContentState,
  convertToRaw,
  EditorState,
  convertFromRaw,
  convertFromHTML,
} from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import Loading from '../../components/loading'
import Meta from '@components/meta'

export async function getServerSideProps(prop) {
  let tags = {}
  let tagRef = ''
  const tagsResult = await getTag(prop.query.slug)
  if (!tagsResult) {
    return {
      redirect: {
        destination: `/404`,
        permanent: false,
      },
    }
  }

  tags = tagsResult.data
  tagRef = tagsResult.ref.value.id

  return {
    props: {
      tags,
      tagRef,
    }, // will be passed to the page component as props
  }
}

const HebrewCollection = ({ tags, tagRef }) => {
  const [activePage, setActivePage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [itemsShown, setItemsShown] = useState([])
  const [itemsPerPage, setItemsPerPage] = useState(6)
  const [classState, setClassState] = useState([])
  // variable to toggle loading gif
  const [isLoading, setIsLoading] = useState(true)
  // variable to toggle error message
  const [hasError, setHasError] = useState(false)
  const [notFoundData, setNotFoundData] = useState(false)

  let product = new Product()
  useEffect(async () => {
    //Product Description convertor start
    if (tags.description) {
      let state
      try {
        state = convertFromRaw(JSON.parse(tags.description))
      } catch {
        const blocksFromHTML = convertFromHTML(`<p>${tags.description}<p>`)
        state = ContentState.createFromBlockArray(
          blocksFromHTML.contentBlocks,
          blocksFromHTML.entityMap
        )
      }

      let descHTML = ''
      try {
        const rawContentState = convertToRaw(state)
        descHTML = draftToHtml(rawContentState)
      } catch (err) {
        console.log(err, 'err from draft')
      }
      tags.descHTML = descHTML
    }
    //Product Description convertor end
    const query = {
      tagRef: tagRef,
    }
    await product
      .getAllProductsbyFilter(query)
      .then((response) => {
        setClassState(response.data.results)
        setIsLoading(false)
      })
      .catch((error) => {
        console.log(error, 'error')
        setHasError(true)
        setIsLoading(false)
      })
  }, [])

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
        title={
          tags.seoTitle
            ? tags.seoTitle
            : tags.name + ' | Online Jewish Learning | AJU Maven'
        }
        keywords={tags.seoKeywords ? tags.seoKeywords : tags.name.toLowerCase()}
        description={tags.seoDesc ? tags.seoDesc : tags.short_description}
        image={tags.desktop_image_url}
      />
      <header className="w-full">
        <Navbar />
      </header>
      <main>
        <Heading
          heading={tags.name}
          breadcrumbs={[
            {
              link: '/',
              label: 'Home',
            },
            {
              link: '/events-classes',
              label: 'Events & Classes',
            },
            {
              link: '/events-classes/' + tags.slug,
              label: tags.name,
            },
          ]}
        />
        <div className="mb-12 sm:mt-6 overflow-hidden max-h-banner">
          <img
            src={tags.desktop_image_url}
            alt="customer suppport image"
            className="object-cover w-full h-auto min-h-banner"
          />
        </div>
        <h1
          className={`max-w-wrapper mx-auto md:px-0 text-2xl sm:text-3xl lg:text-4xl text-blue-850 text-center font-bold -mb-4 px-5`}
        >
          {tags.sub_title}
        </h1>
        <Subheading content={tags.short_description} tags={true} />
        <div className="text-center max-w-wrapper mx-auto px-5 leading-6 sm:text-base text-sm mb-4 -mt-6">
          <Richtext
            text={tags.descHTML}
            className="mb-10 text-center lg:mb-10"
          />
        </div>
        {isLoading || hasError ? (
          <Loading hasError={hasError} />
        ) : (
          <>
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

export default HebrewCollection
