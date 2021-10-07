import Link from 'next/link'
import TextIconInput from './textIconInput'
import Button from './button'
import { useEffect, useState } from 'react'
import { signIn } from 'next-auth/client'
import { useRouter } from 'next/router'
import { getSession } from 'next-auth/client'
import { server } from '../../lib/config/server'
import Loader from '@components/loader'
import ResetPassword from 'lib/models/reset-password'
import { getErrorMessage, hasError } from 'lib/validations/validations'

const ResetPasswordForm = (props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [userInput, setUserInput] = useState({
    confirm_password: '',
    password: '',
    token: '',
  })
  const [errors, setErrors] = useState({})
  const router = useRouter()

  async function submitHandler(e) {
    e.preventDefault()
    setIsLoading(true)

    let rp = new ResetPassword(userInput)
    rp.token = router.query.token

    try {
      await rp.reset().then(async (response) => {
        router.replace(`${server}/login?reset=true`)
      })
    } catch (error) {
      console.log(error)
      setErrors(error)
      setIsLoading(false)
    }
  }

  return (
    <div className="mt-2 form-container sm:mt-6">
      {!isLoading && hasError(errors, 'general') && (
        <h4 className="p-4 text-center text-red-500">
          {getErrorMessage(errors, 'general')}
        </h4>
      )}
      <form method="POST" onSubmit={submitHandler}>
        <TextIconInput
          width="full"
          type="password"
          name="password"
          id="password"
          icon="login-password"
          iconWidth="28"
          placeholder="Password"
          className="mb-12 "
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
          <div className="w-full mb-10">
            <div className="justify-center mx-auto max-w-wrapper">
              <p className="text-center text-red-600">
                {getErrorMessage(errors, 'password')}
              </p>
            </div>
          </div>
        )}
        <TextIconInput
          width="full"
          type="password"
          name="confirm_password"
          id="confirm_password"
          icon="login-password"
          iconWidth="28"
          placeholder="Confirm Password"
          className="mb-6"
          required={true}
          value={userInput.email}
          onChange={(e) => {
            const newUserInput = { ...userInput }
            newUserInput.confirm_password = e.target.value
            setUserInput(newUserInput)
          }}
        />
        {!isLoading && hasError(errors, 'confirm_password') && (
          <div className="w-full mb-10">
            <div className="justify-center mx-auto max-w-wrapper">
              <p className="text-center text-red-600">
                {getErrorMessage(errors, 'confirm_password')}
              </p>
            </div>
          </div>
        )}
        {isLoading && <Loader message="Submitting..." />}
        {!isLoading && (
          <>
            <Button
              buttonContent="Submit"
              type="submit"
              style="blue"
              width="full"
              className="py-5 mb-12"
            />
          </>
        )}
      </form>
    </div>
  )
}

export default ResetPasswordForm
