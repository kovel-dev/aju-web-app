import { useState } from 'react'
import Link from 'next/link'
import TextIconInput from './textIconInput'
import Button from './button'
import Loader from '@components/loader'
import SuccessCheckPopup from '@components/popup/success-check'
import ForgotPassword from 'lib/models/forgot-password'
import { getSession } from 'next-auth/client'
import { server } from '../../lib/config/server'
import { getErrorMessage, hasError } from 'lib/validations/validations'

export async function getServerSideProps(context) {
  // eslint-disable-next-line no-undef
  const session = await getSession({ req: context.req })

  if (session) {
    return {
      redirect: {
        // eslint-disable-next-line no-undef
        destination: `${server}/`,
        permanent: false,
      },
    }
  }

  return {
    props: { session },
  }
}

const ForgotPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [openSuccess, setOpenSuccess] = useState(false)
  const [userInput, setUserInput] = useState({ email: '' })
  const [errors, setErrors] = useState({})

  const closePopup = (remove) => {
    setOpenSuccess(false)
    setIsLoading(false)
  }

  async function submitHandler(e) {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    let fp = new ForgotPassword(userInput)

    try {
      await fp.save().then(async (response) => {
        setIsLoading(false)
        setErrors({})

        // open success message
        setOpenSuccess(true)
        setUserInput({ email: '' })
      })
    } catch (error) {
      console.log(error)
      setErrors(error)
      setIsLoading(false)
    }
  }

  return (
    <div className="mt-2 form-container sm:mt-6">
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
        {isLoading && <Loader message="Submitting..." />}
        {!isLoading && (
          <>
            <Button
              buttonContent="Reset Password"
              type="submit"
              style="blue"
              width="full"
              className="py-5 mb-12"
            />
            <p className="text-lg text-center">
              Return to
              <Link href="/login">
                <a className="text-blue-850 hover:underline"> Login</a>
              </Link>
            </p>
          </>
        )}
      </form>
      {openSuccess && (
        <SuccessCheckPopup
          open={openSuccess}
          closeProp={closePopup}
          titleText="Reset Password Submitted!"
          subText="Check your email for instruction to reset your password."
        />
      )}
    </div>
  )
}

export default ForgotPasswordPage
