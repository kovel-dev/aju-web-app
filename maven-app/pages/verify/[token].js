import axios from 'axios'
import { getSession, signOut } from 'next-auth/client'
import { useEffect, useState } from 'react'
import {
  hasError,
  getErrorMessage,
  validatePassword,
} from '../../lib/validations/validations'
import { server } from '../../lib/config/server'
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
          .get(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/verify/${token}`)
          .then(async (response) => {
            router.replace(`${server}/login?verified=true`)
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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center pb-12 sm:px-6 lg:px-8">
      {isLoading && (
        <div className="text-center mt-5">
          {/* Spinner here */}
          Verifying...
        </div>
      )}
      {!isLoading && hasSession && (
        <div className="container-fluid">
          <div className="text-center mt-5">
            <p>You must be logged out to process email verification.</p>
            <button onClick={logoutHandler}>Sign out</button>
          </div>
        </div>
      )}
      {!isLoading && hasError(errors, 'general') && (
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
      )}
    </div>
  )
}

export default EmailVerificationPage
