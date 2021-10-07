import {
  Footer,
  Heading,
  Layout,
  MailingList,
  Navbar,
  PressItem,
} from '@components'
import Loader from '@components/loader'
import Article from 'lib/models/article'
import { useEffect, useState } from 'react'

const breadcrumbs = [
  { label: 'Home', link: '/' },
  { label: 'In the Press', link: '/press' },
]

const Press = () => {
  // variable to contain hosts/speakers from backend
  const [articlesState, setArticlesState] = useState([])
  // variable to toggle loading gif
  const [isLoading, setIsLoading] = useState(true)
  // variable to toggle error message
  const [hasError, setHasError] = useState(false)

  let article = new Article()

  useEffect(async () => {
    setIsLoading(true)

    await article
      .getList()
      .then((response) => {
        setArticlesState(response.data)
        setIsLoading(false)
      })
      .catch((error) => {
        console.log(error)
        setHasError(true)
        setIsLoading(false)
      })
  }, [])

  return (
    <section className="min-h-fullpage">
      <header className="w-full">
        <Navbar />
      </header>
      <main>
        <Heading heading="In the Press" breadcrumbs={breadcrumbs} />
        {articlesState.length == 0 && !isLoading && !hasError && (
          <div className="max-w-wrapper mx-auto justify-center">
            <p className="text-center">No Article(s) Found.</p>
          </div>
        )}
        {!isLoading && hasError && (
          <div className="max-w-wrapper mx-auto justify-center">
            <p className="text-center text-red-600">
              Ops! Sorry something went wrong getting the list of article(s).
            </p>
          </div>
        )}
        {isLoading && <Loader message={'Loading...'} />}
        {articlesState.length > 0 && !isLoading && !hasError && (
          <Layout className="mt-4 lg:mt-6">
            {articlesState.map((item, itemIndex) => (
              <PressItem item={item} key={itemIndex} />
            ))}
          </Layout>
        )}
      </main>
      <MailingList />
      <Footer />
    </section>
  )
}

export default Press
