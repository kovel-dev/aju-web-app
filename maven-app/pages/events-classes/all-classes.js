import Heading from '../../components/heading'
import Footer from '../../components/footer'
import MailingList from '../../components/mailingList'
import Navbar from '../../components/navbar'
import { Meta } from '../../components'
import meta from '../../constants/meta'
import ProgramPaginationContainer from '@components/blocks/program-pagination-container'

const AllClasses = () => {
  return (
    <div className="min-h-fullpage">
      <Meta
        title={meta.allClasses.title}
        keywords={meta.allClasses.keywords}
        description={meta.allClasses.description}
      />
      <header className="w-full">
        <Navbar />
      </header>
      <main>
        <Heading
          heading="All Classes"
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
              link: '/events-classes/all-classes',
              label: 'All Classes',
            },
          ]}
        />
        {/* All Events in Paginated format */}
        <ProgramPaginationContainer programType="class-series" title="" />
      </main>
      <MailingList />
      <Footer />
    </div>
  )
}

export default AllClasses
