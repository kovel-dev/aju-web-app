import axios from 'axios'
import Head from 'next/head'
import Link from 'next/link'
import Loader from '@components/loader'
import ResetPasswordForm from '@components/form/formResetPassword'
import { getSession, signOut } from 'next-auth/client'
import { useEffect, useState } from 'react'
import {
  hasError,
  getErrorMessage,
  validatePassword,
} from '../../../lib/validations/validations'
import { server } from '../../../lib/config/server'
import { useRouter } from 'next/router'

function EmailVerificationPage() {
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [hasSession, setSession] = useState(null)
  const router = useRouter()

  useEffect(async () => {
    let sessionRes = await getSession()
    const token = router.query.token

    if (sessionRes) {
      setSession(sessionRes)
      setIsLoading(false)
    } else {
      if (token) {
        await axios
          .get(
            `${process.env.NEXT_PUBLIC_ADMIN_API_URL}/verify/reset-password/${token}`
          )
          .then(async (response) => {
            return
          })
          .catch((error) => {
            setErrors(error.response.data)
          })
        setIsLoading(false)
      }
    }
  }, [router])

  function logoutHandler() {
    signOut({
      callbackUrl: process.env.NEXT_PUBLIC_APP_URL,
    })
  }

  return (
    <>
      <div>
        <Head>
          <title>Reset Password</title>
          <meta name="description" content="Reset Password" />
          <link rel="icon" href="/favicon.png" />
        </Head>
        {!isLoading && !hasSession && !hasError(errors, 'general') && (
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
              {isLoading && <Loader />}
              {!isLoading && <ResetPasswordForm />}
            </div>
          </main>
        )}
        {isLoading && (
          <div className="min-h-screen flex flex-col justify-center pb-12 sm:px-6 lg:px-8">
            <Loader message="Verifying..." />
          </div>
        )}
        {!isLoading && hasSession && (
          <div className="min-h-screen bg-gray-50 flex flex-col justify-center pb-12 sm:px-6 lg:px-8">
            <div className="container-fluid">
              <div className="text-center mt-5">
                <p>You must be logged out to reset your password.</p>
                <button onClick={logoutHandler}>Sign out</button>
              </div>
            </div>
          </div>
        )}
        {!isLoading && hasError(errors, 'general') && (
          <div className="min-h-screen bg-gray-50 flex flex-col justify-center pb-12 sm:px-6 lg:px-8">
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="bg-red-150 text-white h-8 w-8 inline-flex items-center justify-center text-xl ml-1 top-1.5 sm:top-2 right-1.5">
                    !
                  </span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    {getErrorMessage(errors, 'general')}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default EmailVerificationPage
