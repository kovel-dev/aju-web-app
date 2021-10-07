import Head from 'next/head'
import Link from 'next/link'
import FormForgotPassword from '../components/form/formForgotPassword'
import { getSession } from 'next-auth/client'
import { server } from '../lib/config/server'

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req })

  if (session) {
    return {
      redirect: {
        destination: `${server}/`,
        permanent: false,
      },
    }
  }

  return {
    props: { session },
  }
}

export default function Login() {
  return (
    <div>
      <Head>
        <title>Reset Password</title>
        <meta name="description" content="Login" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <main className="min-h-screen px-4 pt-16 md:pt-20 bg-gray-50 sm:px-0 md:pb-16 pb-11">
        <Link href="/">
          <a>
            <img
              src="/images/maven_logo2.png"
              alt="Maven logo"
              className="w-auto mx-auto h-14 sm:h-16"
            />
          </a>
        </Link>
        <div className="max-w-sm px-3 pb-16 mx-auto bg-white rounded-sm lg:mx-auto shadow-2 md:max-w-4xl md:pb-24 md:px-28 md:mt-16 mt-11">
          <h1 className="pt-12 pb-6 text-2xl font-bold text-center sm:text-3xl lg:text-4xl text-blue-850">
            Reset Your Password
          </h1>
          <p className="text-lg text-center">
            Enter your username below and we’ll email you instructions{' '}
            <span className="sm:whitespace-nowrap">
              to reset your password.
            </span>
          </p>
          <FormForgotPassword />
        </div>
      </main>
    </div>
  )
}
