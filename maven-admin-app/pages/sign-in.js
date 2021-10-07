import SignInForm from '../components/auth/sign-in-form'
import { getSession } from 'next-auth/client'
import { server } from '../lib/config/server'

function LoginPage() {
  return <SignInForm />
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

export default LoginPage
LoginPage.auth = true
