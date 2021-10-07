import Link from 'next/link'

import TextIconInput from '../form/textIconInput'
import Button from '../form/button'

export default function FormContainer() {
  return (
    <div className="mt-2 form-container sm:mt-8 md:mt-12">
      <form>
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
        />
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
        />
        <Button
          buttonContent="Login"
          type="submit"
          style="blue"
          width="full"
          className="py-5 mb-12"
        />
        <p className="text-xl text-center">
          or{' '}
          <Link href="/forgot">
            <a className="underline text-blue-850">Forgot Password</a>
          </Link>
        </p>
        <p className="mt-5 text-xl tracking-tight text-center sm:tracking-normal">
          Don't have an account?{' '}
          <Link href="/sign-up">
            <a className="font-bold underline text-blue-850">Sign Up</a>
          </Link>{' '}
        </p>
      </form>
    </div>
  )
}
