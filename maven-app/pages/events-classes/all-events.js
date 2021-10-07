import Heading from '../../components/heading'
import Footer from '../../components/footer'
import MailingList from '../../components/mailingList'
import Navbar from '../../components/navbar'
import { Meta } from '../../components'
import meta from '../../constants/meta'
import ProgramPaginationContainer from '@components/blocks/program-pagination-container'

const AllEvents = () => {
  return (
    <div className="min-h-fullpage">
      <Meta
        title={meta.allEvents.title}
        keywords={meta.allEvents.keywords}
        description={meta.allEvents.description}
      />
      <header className="w-full">
        <Navbar />
      </header>
      <main>
        <Heading
          heading="All Events"
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
              link: '/events-classes/all-events',
              label: 'All Events',
            },
          ]}
        />
        {/* All Events in Paginated format */}
        <ProgramPaginationContainer programType="event" title="" />
      </main>
      <MailingList />
      <Footer />
    </div>
  )
}

export default AllEvents
