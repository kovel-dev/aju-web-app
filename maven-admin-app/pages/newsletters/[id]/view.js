import { getSession } from 'next-auth/client'
import { server } from '../../../lib/config/server'
import TableView from '../../../components/newsletters/table-view'

function ListOfNewslettersPage() {
  return (
    <>
      <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 grid grid-cols-3">
        <h1 className="col-span-2 text-2xl font-semibold text-gray-900">
          View Newsletter
        </h1>
      </div>
      <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Replace with your content */}
        <div className="py-4">
          <TableView view />
        </div>
        {/* /End replace */}
      </div>
    </>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req })

  if (!session) {
    return {
      redirect: {
        destination: `${server}/sign-in`,
        permanent: false,
      },
    }
  }

  return {
    props: { session },
  }
}

export default ListOfNewslettersPage
