import { getSession } from 'next-auth/client'
import { server } from '../../../lib/config/server'
import ListOfUsers from '../../../components/users/list'

function UserListPage() {
  return (
    <>
      <ListOfUsers />
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

export default UserListPage
