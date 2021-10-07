import React, { useEffect, useState } from 'react'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js'
import CardSection from './cardSection'

function checkoutForm() {
  // Simple cardError state to show error from stripe card element
  const [cardError, setCardError] = useState('')

  //Bring the initial amount from URL/Session to create the stripe payment intent.
  const [payAmount, setPayAmount] = useState(34.99)
  const [clientSecret, setClientSecret] = useState('')

  // Init stripe and do some magic here
  const stripe = useStripe()
  const elements = useElements()
  const card = elements?.getElement(CardElement)

  const createPaymentIntent = async (amountValue) => {
    console.log('payAmount: ', payAmount)
    const res = await fetch('/api/paygate/createintent', {
      method: 'POST',
      body: JSON.stringify({
        amount: amountValue,
      }),
    })
    const { clientSecret: clientSecretRes } = await res.json()
    setClientSecret(clientSecretRes)
  }

  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault()

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return
    }

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: 'TK Test',
        },
      },
    })

    if (result.error) {
      // Show error to your customer (e.g., insufficient funds)
      console.log(result.error.message)
    } else {
      // The payment has been processed!
      if (result.paymentIntent.status === 'succeeded') {
        console.log(result.paymentIntent)
        // Show a success message to your customer
        // There's a risk of the customer closing the window before callback
        // execution. Set up a webhook or plugin to listen for the
        // payment_intent.succeeded event that handles any business critical
        // post-payment actions.
      }
    }
  }

  // useEffect(() => {
  //     createPaymentIntent(payAmount);
  // }, [payAmount]);

  function updatePrice(e) {
    e.preventDefault()
    setPayAmount(54.99)
  }

  return (
    <>
      <p className="text-xl text-black">Payment Amount: {payAmount}</p>
      <form onSubmit={handleSubmit}>
        <CardSection />
        <button onClick={updatePrice}>Update Price</button>
        <button disabled={!stripe}>Confirm order</button>
      </form>
    </>
  )
}

export default checkoutForm
