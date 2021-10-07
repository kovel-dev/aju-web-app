import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getSession } from 'next-auth/client'

import { server } from '../lib/config/server'
import FormLogin from '../components/form/formLogin'
import SuccessCheckPopup from '@components/popup/success-check'
import Loader from '@components/loader'

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
  const [isLoading, setIsLoading] = useState(true)
  const [openSuccess, setOpenSuccess] = useState(false)
  const [titleMessage, setTitleMessage] = useState('')
  const [subTextMessage, setSubTextMessage] = useState('')
  const router = useRouter()

  useEffect(async () => {
    const isVerify = router.query.verified
    if (isVerify == 'true') {
      setTitleMessage('Your account is now active.')
      setSubTextMessage('Please sign in to continue.')
      setOpenSuccess(true)
    }

    const isReset = router.query.reset
    if (isReset == 'true') {
      setTitleMessage('Your new password has been set')
      setSubTextMessage('Try logging in with your new credentials.')
      setOpenSuccess(true)
    }

    setIsLoading(false)
  }, [router])

  const closePopup = (remove) => {
    setOpenSuccess(false)
    setIsLoading(false)
  }

  return (
    <div>
      <Head>
        <title>Login</title>
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
            Welcome to Maven
          </h1>
          {isLoading && <Loader />}
          {!isLoading && <FormLogin />}
        </div>
        {openSuccess && (
          <SuccessCheckPopup
            open={openSuccess}
            closeProp={closePopup}
            titleText={titleMessage}
            subText={subTextMessage}
          />
        )}
      </main>
    </div>
  )
}
