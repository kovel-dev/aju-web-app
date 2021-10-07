import { useRouter } from 'next/router'

import {
  Banner,
  Button,
  CalloutBlue,
  CardContainer,
  Footer,
  MailingList,
  Meta,
  Navbar,
  Subheading,
  QuoteContainer,
} from 'components'
import {
  getPageData,
  getFeaturedTags,
  getUpcomingEvents,
  getFeaturedPrograms,
} from '../lib/handlers/fauna-function-handlers'
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

  //Get Upcoming Events
  const upcomingEvents = await getUpcomingEvents(3)

  //Get Featured On-Demand Programs
  const featuredOnDemands = await getFeaturedPrograms('on-demand', 3)

  return {
    props: { pageData, featuredTags, upcomingEvents, featuredOnDemands }, // will be passed to the page component as props
  }
}

const Home = ({
  pageData,
  featuredTags,
  upcomingEvents,
  featuredOnDemands,
}) => {
  const router = useRouter()

  let quotesArr = {}
  let bannerProps = {}
  if (Object.keys(pageData).length > 0) {
    bannerProps['bannerImage'] = pageData.bannerImage
    bannerProps['title'] = pageData.title
    bannerProps['buttonLabel'] = pageData.buttonLabel
    bannerProps['buttonLink'] = pageData.buttonLink
    bannerProps['bannerVideo'] = pageData.bannerVideo

    quotesArr = pageData.testimonials ? pageData.testimonials : {}
  }

  return (
    <div className="min-h-fullpage">
      <Meta
        title={meta.home.title}
        keywords={meta.home.keywords}
        description={meta.home.description}
      />
      <header className="w-full">
        <Navbar />
        {Object.keys(bannerProps).length > 0 && (
          <Banner
            img={bannerProps['bannerImage']}
            ctaContent={bannerProps['title']}
            ctaBtnContent={bannerProps['buttonLabel']}
            ctaLink={bannerProps['buttonLink']}
          />
        )}
      </header>
      <main className="-mt-5 sm:-mt-20">
        {/* Featured Tags */}
        {Object.keys(featuredTags).length > 0 && (
          <div aria-label="Featured Tags Section">
            <Subheading content="Become a Maven today. We invite you to learn with us." />
            <CardContainer schema={featuredTags} />
          </div>
        )}
        {/* Upcoming Events */}
        {Object.keys(upcomingEvents).length > 0 && (
          <div aria-label="Featured Tags Section">
            <Subheading content="Upcoming Events" />
            <CardContainer schema={upcomingEvents} />
            <div className="flex items-center justify-center w-full my-10 sm:my-12">
              <Button
                type="button"
                buttonContent="View all Events"
                action={() => router.push('/events-classes')}
                icon={'/images/calendar.svg'}
              />
            </div>
          </div>
        )}
        <CalloutBlue
          mainContent="Stay connected. Explore the world of Jewish learning."
          description="Advance ideas and engage in dialogue and debate."
        />
        <div className="mx-auto max-w-wrapper">
          <Subheading
            content="Tap into learning whenever, wherever."
            secondRow="Explore our on demand library."
          />
        </div>
        {Object.keys(featuredOnDemands).length > 0 && (
          <div aria-label="Featured Tags Section">
            <CardContainer schema={featuredOnDemands} />
            <div className="flex items-center justify-center w-full my-10 sm:my-12">
              <Button
                type="button"
                buttonContent="View on demand library"
                action={() => router.push('/on-demand')}
              />
            </div>
          </div>
        )}

        <Subheading content="What our audience is saying." />
        {Object.keys(quotesArr).length > 0 && (
          <QuoteContainer schema={quotesArr} />
        )}
      </main>
      <MailingList />
      <Footer />
    </div>
  )
}

export default Home
