import Link from 'next/link'
import TextIconInput from './textIconInput'
import Button from './button'
import { useState } from 'react'
import { signIn } from 'next-auth/client'
import { useRouter } from 'next/router'
import { getSession } from 'next-auth/client'
import { server } from '../../lib/config/server'
import Loader from '@components/loader'

import * as Yup from 'yup'
import { getErrorMessage, hasError } from 'lib/validations/validations'

const LoginValidation = () => {
  let yupObj = {
    email: Yup.string()
      .email({ key: 'email', values: 'Email is invalid' })
      .required({ key: 'email', values: 'Email is required' }),
    password: Yup.string()
      .min(2, { key: 'password', values: 'The field is too short' })
      .max(255, { key: 'password', values: 'The field is too long' })
      .required({ key: 'password', values: 'Password is required' }),
  }

  return Yup.object().shape(yupObj)
}

const Login = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [userInput, setUserInput] = useState({ email: '', password: '' })
  const [signInError, setSignInError] = useState(null)
  const [errors, setErrors] = useState({})
  const router = useRouter()

  async function submitHandler(e) {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})
    setSignInError(null)

    // optional: Add validation
    await LoginValidation()
      .validate(userInput, { abortEarly: false })
      .then(async (value) => {
        const result = await signIn('credentials', {
          redirect: false,
          email: userInput.email,
          password: userInput.password,
        })

        if (!result.error) {
          const session = await getSession()
          let redirectUrl = `${server}/`

          // redirect user based on role
          if (location.search.includes('redirect=')) {
            const redirectLink = location.search.split('?redirect=')[1]
            redirectUrl += redirectLink
          } else if (session.user.role == 'student') {
            redirectUrl += 'individual/dashboard'
          } else if (session.user.role == 'partner') {
            redirectUrl += 'organization/dashboard'
          }

          router.replace(redirectUrl)
          setSignInError(null)
        } else {
          setSignInError(result.error)
          // remove password
          const newUserInput = { ...userInput }
          newUserInput.password = ''
          setUserInput(newUserInput)
          setIsLoading(false)
        }
      })
      .catch(function (err) {
        setErrors(err.errors)
        setIsLoading(false)
      })
  }

  return (
    <div className="mt-2 form-container sm:mt-6">
      {signInError && (
        <h4 className="p-4 text-center text-red-500">{signInError}</h4>
      )}
      <form method="POST" onSubmit={submitHandler}>
        <TextIconInput
          width="full"
          type="email"
          name="email"
          id="email"
          icon="login-email"
          iconWidth="28"
          placeholder="Email"
          className="mb-6"
          required={true}
          value={userInput.email}
          onChange={(e) => {
            const newUserInput = { ...userInput }
            newUserInput.email = e.target.value
            setUserInput(newUserInput)
          }}
        />
        {!isLoading && hasError(errors, 'email') && (
          <div className="w-full mb-5">
            <div className="justify-center mx-auto max-w-wrapper">
              <p className="text-center text-red-600">
                {getErrorMessage(errors, 'email')}
              </p>
            </div>
          </div>
        )}

        <TextIconInput
          width="full"
          type="password"
          name="password"
          id="password"
          icon="login-password"
          iconWidth="28"
          placeholder="Password"
          className="mb-6 "
          required={true}
          value={userInput.password}
          autoComplete="off"
          onChange={(e) => {
            const newUserInput = { ...userInput }
            newUserInput.password = e.target.value
            setUserInput(newUserInput)
          }}
        />
        {!isLoading && hasError(errors, 'password') && (
          <div className="w-full mb-5">
            <div className="justify-center mx-auto max-w-wrapper">
              <p className="text-center text-red-600">
                {getErrorMessage(errors, 'password')}
              </p>
            </div>
          </div>
        )}
        {isLoading && <Loader />}
        {!isLoading && (
          <>
            <Button
              buttonContent="Login"
              type="submit"
              style="blue"
              width="full"
              className="py-5 mb-12"
            />
            <p className="text-lg text-center">
              or{' '}
              <Link href="/forgot-password">
                <a className="text-blue-850 hover:underline">Forgot Password</a>
              </Link>
            </p>
            <p className="mt-5 text-lg tracking-tight text-center sm:tracking-normal">
              Don't have an account?{' '}
              <Link href="/sign-up">
                <a className="font-bold text-blue-850 hover:underline">
                  Sign Up
                </a>
              </Link>{' '}
              to register for programs!
            </p>
          </>
        )}
      </form>
    </div>
  )
}

export default Login
