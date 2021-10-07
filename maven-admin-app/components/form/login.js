import { useState } from 'react'
import { signIn } from 'next-auth/client'
import { useRouter } from 'next/router'
import { server } from '../../lib/config/server'
import TextInput from './text-input'
import Logo from '../layouts/logo'
import Meta from '../meta'

const Login = () => {
  const [userInput, setUserInput] = useState({ email: '', password: '' })
  //if local development, prefill the login details
  //TODO remove this code block before production push
  const router = useRouter()
  const [signInError, setSignInError] = useState({
    hasError: false,
    errorMsg: '',
  })

  async function submitHandler(e) {
    e.preventDefault()
    // optional: Add validation
    const result = await signIn('credentials', {
      redirect: false,
      email: userInput.email,
      password: userInput.password,
    })

    if (!result.error) {
      // set some auth state
      router.replace(`${server}/dashboard`)
    } else {
      setSignInError({ hasError: true, errorMsg: result.error })
    }
  }

  return (
    <div className="min-h-screen bg-primary flex flex-col justify-center pb-12 sm:px-6 lg:px-8">
      <Meta title="Login | Maven Admin" keywords="" description="" />
      <Logo />
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {signInError.hasError && (
            <h4 className="text-center p-4 text-red-500">
              {signInError.errorMsg}
            </h4>
          )}
          <form className="space-y-6" method="POST" onSubmit={submitHandler}>
            <TextInput
              label="Email address"
              id="email"
              name="email"
              type="email"
              value={userInput.email}
              onChange={(e) => {
                const newUserInput = { ...userInput }
                newUserInput.email = e.target.value
                setUserInput(newUserInput)
              }}
              placeholder=""
              required={true}
              disabled={false}
              autoComplete="on"
              hasError={signInError.hasError}
            />
            <TextInput
              label="Password"
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
              disabled={false}
              autoComplete="off"
              hasError={signInError.hasError}
            />
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
