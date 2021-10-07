import StartingPage from '../components/dashboard/starting-page'
import { server } from '../lib/config/server'
import { getSession } from 'next-auth/client'

function Home() {
  return <StartingPage />
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req })

  if (session) {
    return {
      redirect: {
        destination: `${server}/dashboard`,
        permanent: false,
      },
    }
  }

  return {
    props: { session },
  }
}

export default Home
