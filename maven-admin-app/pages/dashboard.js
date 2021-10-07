import { getSession } from 'next-auth/client'
import { server } from '../lib/config/server'
import Dashboard from '../components/dashboard/dashboard'

function DashboardPage() {
  return <Dashboard />
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

export default DashboardPage
