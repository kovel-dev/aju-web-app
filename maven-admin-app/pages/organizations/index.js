import { getSession } from 'next-auth/client'
import { server } from '../../lib/config/server'
import TableView from '../../components/organizations/table-view'

function ListOfOrganizationPage() {
  return (
    <>
      <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 grid grid-cols-3">
        <h1 className="col-span-2 text-2xl font-semibold text-gray-900">
          All Organization
        </h1>
        {/* <div className="text-right">
          <a
            href={`${server}/organizations/create`}
            className="w-1/3 px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Create Organization
          </a>
        </div> */}
      </div>
      <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Replace with your content */}
        <div className="py-4">
          <TableView />
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

export default ListOfOrganizationPage
