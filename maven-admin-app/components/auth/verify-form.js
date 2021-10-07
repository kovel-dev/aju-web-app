import axios from 'axios'
import TextInput from '../form/text-input'
import { getSession, signOut } from 'next-auth/client'
import { useEffect, useState } from 'react'
import {
  hasError,
  getErrorMessage,
  validatePassword,
} from '../../lib/validations/validations'
import { server } from '../../lib/config/server'
import { useRouter } from 'next/router'
import Loader from '../loader'

function EmailVerificationForm() {
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [userInput, setUserInput] = useState({
    password: '',
    confirm_password: '',
  })
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
          .get(`${server}/api/verify/${token}`)
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
    signOut()
  }

  async function submitHandler(e) {
    e.preventDefault()
    setIsLoading(true)
    const token = router.query.token

    try {
      await validatePassword(userInput)
    } catch (error) {
      console.log(error)
      setErrors(error)
      setIsLoading(false)
      return
    }

    if (token) {
      await axios
        .post(`${server}/api/verify/${token}`, userInput)
        .then((response) => {
          router.replace(`${server}/sign-in`)
          return
        })
        .catch((error) => {
          console.log(error.response.data)
          setErrors(error.response.data)
          setIsLoading(false)
        })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center pb-12 sm:px-6 lg:px-8">
      {isLoading && (
        <div className="text-center mt-5">
          <Loader message={'Processing...'} />
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
        <div className="justify-center mx-auto max-w-wrapper">
          <p className="text-center text-red-600">
            {getErrorMessage(errors, 'general')}
          </p>
        </div>
      )}
      {!isLoading && !hasSession && !hasError(errors, 'general') && (
        <>
          <h2 className="mt-0 text-center text-3xl font-bold text-gray-900">
            Verify your Email
          </h2>
          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <form
                className="space-y-6"
                method="POST"
                onSubmit={submitHandler}
              >
                <TextInput
                  label="New Password"
                  id="password"
                  name="password"
                  type="password"
                  value={userInput.password}
                  onChange={(e) => {
                    const newUserInput = { ...userInput }
                    newUserInput.password = e.target.value
                    setUserInput(newUserInput)
                  }}
                  placeholder=""
                  required={true}
                  disabled={isLoading}
                  autoComplete="on"
                />
                {hasError(errors, 'password') && (
                  <span className={`block text-sm font-medium text-red-400`}>
                    {getErrorMessage(errors, 'password')}
                  </span>
                )}
                <TextInput
                  label="Confirm Password"
                  id="confirm_password"
                  name="confirm_password"
                  type="password"
                  value={userInput.confirm_password}
                  onChange={(e) => {
                    const newUserInput = { ...userInput }
                    newUserInput.confirm_password = e.target.value
                    setUserInput(newUserInput)
                  }}
                  placeholder=""
                  required={true}
                  disabled={isLoading}
                  autoComplete="off"
                />
                {hasError(errors, 'confirm_password') && (
                  <span className={`block text-sm font-medium text-red-400`}>
                    {getErrorMessage(errors, 'confirm_password')}
                  </span>
                )}

                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing...' : 'Verify'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default EmailVerificationForm
