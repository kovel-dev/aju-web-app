import React from 'react'
import TextInput from '@components/form/textInput'
import { CardElement } from '@stripe/react-stripe-js'

const CARD_ELEMENT_OPTIONS = {
  hidePostalCode: true,
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Montserrat", sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '18px',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
}

function cardSection({ error, errorMsg, errorClass }) {
  return (
    <>
      <div className={`mt-1 sm:mt-0 sm:col-span-2 relative md:max-w-full`}>
        <CardElement
          options={CARD_ELEMENT_OPTIONS}
          className={`block w-full md:max-w-full sm:text-lg border-gray-75 border px-3 py-3 mb-4 placeholder-black focus:outline-none rounded-sm ${errorClass}`}
        />
        {errorMsg && (
          <span className="bg-red-150 text-white h-8 w-8 inline-flex items-center justify-center text-xl absolute ml-1 top-1.5 sm:top-2 right-1.5">
            !
          </span>
        )}
        {errorMsg && (
          <p className="px-3 mt-2 text-xs text-red-150">{errorMsg}</p>
        )}
      </div>
    </>
  )
}

export default cardSection
