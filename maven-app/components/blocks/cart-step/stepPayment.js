import { Heading3 } from '@components/partials'
import { Text } from '@components/partials'
import React, { useState, useEffect, useMemo } from 'react'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js'
import { getErrorMessage, hasError } from 'lib/validations/validations'
import { server } from 'lib/config/server'
import TextInput from '@components/form/textInput'
import CheckboxGroup from '@components/form/checkboxGroup'
import CardSection from '../../stripe/cardSection'
import Loader from '@components/loader'
import Cart from 'lib/models/cart'
import axios from 'axios'
import QuestionContainer from '../questionContainer'

const StepPayment = ({
  totalPrice,
  onNextStep,
  onPrevStep,
  cartMeta,
  userId,
  questions,
}) => {
  let cart = new Cart({})
  // Bring the initial amount from URL/Session to create the stripe payment intent.
  const [clientSecret, setClientSecret] = useState('')
  const [clientIntentId, setclientIntentId] = useState('')
  // Simple cardError state to show error from stripe card element
  const [cardError, setCardError] = useState('')

  const [cardHolderName, setCardHolderName] = useState('')
  const [initialAmount] = useState(totalPrice)
  const [payAmount, setPayAmount] = useState(totalPrice)
  const [promoPrice, setPromoPrice] = useState(0)
  const [promoCodes, setPromoCodes] = useState([])
  const [promoCodeInput, setPromoCodeInput] = useState('')
  const [isSubscribe, setIsSubscribe] = useState(false)

  // variable to toggle loading gif
  const [isLoading, setIsLoading] = useState(true)
  const [loadingMsg, setLoadingMsg] = useState('Loading...')
  // variable to toggle error message
  const [errors, setErrors] = useState({})
  // variable to toggle error message
  const [hasErrorMsg, setHasErrorMsg] = useState(false)
  // variable to hold the answers for question
  const [answers, setAnswers] = useState({})
  // variable to hold answers errors
  const [answersErr, setAnswersErr] = useState({})

  // Init stripe and do some magic here
  const stripe = useStripe()
  const elements = useElements()

  // whenever there's changes on total amount create a stripe intent
  useEffect(() => {
    if (payAmount > 0) {
      createPaymentIntent(payAmount)
    } else {
      setIsLoading(false)
    }
  }, [payAmount])

  const reCalculatePayAmount = () => {
    if (promoCodes.length > 0) {
      let totalDiscount = 0
      let newPayAmount = 0

      // loop promo code with product linked and deduct
      let discount = 0
      cartMeta.map((cartItem, cartIndex) => {
        promoCodes.map((item, index) => {
          if (item.productIds.length > 0) {
            item.productIds.map((id, index) => {
              if (cartItem.productId == id) {
                discount =
                  Number(item.percentage / 100) * Number(cartItem.total)
              }
            })
          }
        })
      })

      newPayAmount = totalPrice - discount

      // loop promo code without product linked and deduct
      let arrOfPercentageWithoutProdLinked = []
      promoCodes.map((item, index) => {
        if (item.productIds.length <= 0) {
          arrOfPercentageWithoutProdLinked.push(item.percentage)
        }
      })

      let discount2 = 0
      if (arrOfPercentageWithoutProdLinked.length > 0) {
        arrOfPercentageWithoutProdLinked.map((percentage, percentageIndex) => {
          discount2 = (percentage / 100) * newPayAmount
        })
      }

      totalDiscount = discount + discount2
      newPayAmount = newPayAmount - discount2

      setPayAmount(newPayAmount)
      setPromoPrice(totalDiscount)
    }
  }

  // intent creation
  const createPaymentIntent = async (amountValue) => {
    // intent creation
    try {
      await axios
        .post(`${server}/api/paygate/createintent`, {
          amount: amountValue,
          intentId: clientIntentId,
        })
        .then((response) => {
          const { clientSecret: clientSecretRes, intentId: clientIntentRes } =
            response.data

          if (clientSecretRes && clientIntentRes) {
            setClientSecret(clientSecretRes)
            setclientIntentId(clientIntentRes)
          }
        })
    } catch (error) {
      const { errorMsgDetails: errorMsg } = error.response.data
      setCardError(errorMsg)
      setHasErrorMsg(true)
    }

    setIsLoading(false)
  }

  const applyPromoCode = async () => {
    setIsLoading(true)
    setHasErrorMsg(false)
    setErrors({})
    setLoadingMsg('Verifying your promo code...')

    try {
      await cart.verifyPromoCode(promoCodeInput).then((response) => {
        // set new promocodes
        promoCodes.push(response)
        setPromoCodes(promoCodes)
        reCalculatePayAmount()
        setIsLoading(false)
      })
    } catch (error) {
      setErrors(error)
      setHasErrorMsg(true)
      setIsLoading(false)
    }

    setPromoCodeInput('')
  }

  const completePayment = async () => {
    setIsLoading(true)
    setHasErrorMsg(false)
    setErrors({})
    setAnswersErr({})
    setLoadingMsg('Submitting...')

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      setErrors([{ key: 'general', values: 'Stripe not loaded properly' }])
      setIsLoading(false)
      return
    }

    setLoadingMsg('Validating...')
    if (payAmount > 0) {
      if (cardHolderName.length == 0) {
        setErrors([
          { key: 'cardHolderName', values: 'Cardholder Name is required.' },
        ])
        setIsLoading(false)
        return
      } else if (cardHolderName.length <= 2 || cardHolderName.length > 255) {
        setErrors([
          {
            key: 'cardHolderName',
            values:
              'Cardholder Name should have a minimum of 2 and maximum 255 characters.',
          },
        ])
        setIsLoading(false)
        return
      }
    }

    if (questions.length > 0) {
      let answerErrors = []

      for (let index = 0; index < questions.length; index++) {
        const questionProfile = questions[index]
        const questionItems = questionProfile.questions

        for (let index = 0; index < questionItems.length; index++) {
          let isFound = false
          const question = questionItems[index]

          for (const key in answers) {
            if (Object.hasOwnProperty.call(answers, key)) {
              const productId = key
              const answerItems = answers[key]

              if (productId == questionProfile.programId) {
                for (const key in answerItems) {
                  if (Object.hasOwnProperty.call(answerItems, key)) {
                    const answer = answerItems[key]
                    if (key == question.id) {
                      isFound = true

                      if (question.isRequired == 'yes' && answer.length <= 0) {
                        answerErrors.push({
                          key: question.id + questionProfile.programId,
                          values: `${question.label} is required`,
                        })
                      }
                    }
                  }
                }
              }
            }
          }

          if (question.isRequired == 'yes' && isFound == false) {
            answerErrors.push({
              key: question.id + questionProfile.programId,
              values: `${question.label} is required`,
            })
          }
        }
      }

      if (answerErrors.length > 0) {
        setAnswersErr(answerErrors)
        setIsLoading(false)
        return
      }
    }

    setLoadingMsg('Checking capacity...')
    try {
      await cart.checkAvailability(promoCodes)
    } catch (error) {
      setErrors(error)
      setHasErrorMsg(true)
      setIsLoading(false)
      return
    }

    setLoadingMsg('Submitting payment...')
    let transactionId = ''
    if (payAmount > 0) {
      try {
        // ref: https://stripe.com/docs/api/payment_methods/create#create_payment_method-billing_details
        let stripeBody = {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: cardHolderName,
            },
          },
        }
        await stripe
          .confirmCardPayment(clientSecret, stripeBody)
          .then((result) => {
            if (result) {
              if (result.error) {
                throw [{ key: 'general', values: result.error.message }]
              } else if (result.paymentIntent.status === 'succeeded') {
                transactionId = result.paymentIntent.id
              }
            } else {
              throw [{ key: 'general', values: 'Sorry! Something went wrong' }]
            }
          })
      } catch (error) {
        setErrors(error)
        setHasErrorMsg(true)
        setIsLoading(false)
        return
      }

      if (transactionId.length > 0 && payAmount > 0) {
        setLoadingMsg('Transacting...')
        try {
          await cart
            .checkout(
              isSubscribe,
              promoCodes,
              payAmount,
              cardHolderName,
              transactionId,
              answers
            )
            .then((result) => {
              let sent = result.emailSend ? '' : '?sent=false'
              onNextStep(`${server}/confirmation/` + result.redirectLink + sent)
            })
        } catch (error) {
          setErrors(error)
          setHasErrorMsg(true)
          setIsLoading(false)
          return
        }
      } else {
        setErrors([
          {
            key: 'general',
            values:
              'Sorry! Something went wrong getting your transaction details',
          },
        ])
        setHasErrorMsg(true)
        setIsLoading(false)
        return
      }
    } else if (transactionId.length == 0 && payAmount <= 0) {
      setLoadingMsg('Processing...')
      try {
        await cart
          .checkout(
            isSubscribe,
            promoCodes,
            payAmount,
            cardHolderName,
            transactionId,
            answers
          )
          .then((result) => {
            let sent = result.emailSend ? '' : '?sent=false'
            onNextStep(`${server}/confirmation/` + result.redirectLink + sent)
          })
      } catch (error) {
        setErrors(error)
        setHasErrorMsg(true)
        setIsLoading(false)
        return
      }
    }
  }

  const handleOnCheck = (e) => {
    setIsSubscribe(document.getElementById('consent').checked)
  }

  return (
    <>
      {questions.length > 0 && (
        <>
          {questions.map((item, index) => {
            return (
              <div key={index}>
                <div className="px-5 mx-auto max-w-wrapper mb-5">
                  <div className="grid grid-cols-1 gap-3 lg:grid-cols-5 lg:gap-10">
                    <div className="lg:col-span-3 mt-6 lg:mt-0">
                      <Heading3
                        heading={'Questions for ' + item.programName}
                        className="mb-3 uppercase text-center lg:text-left"
                      />
                    </div>
                  </div>
                </div>

                <QuestionContainer
                  answers={answers}
                  questions={item.questions}
                  answerHandler={setAnswers}
                  errors={answersErr}
                  isLoading={isLoading}
                  programId={item.programId}
                />
              </div>
            )
          })}
        </>
      )}
      <div className="px-5 mx-auto max-w-wrapper">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-5 lg:gap-10">
          <div
            className={
              payAmount > 0
                ? 'lg:col-span-3 mt-6 lg:mt-0'
                : 'lg:col-span-5 mt-6 lg:mt-0'
            }
          >
            {payAmount > 0 && (
              <>
                <Heading3
                  heading="Please enter your payment information"
                  className="mb-3 uppercase text-center lg:text-left"
                />
                <Text text="(Payment processed by Stripe)" className="mb-10" />
              </>
            )}
            <div className="payment-form">
              {payAmount > 0 && (
                <>
                  <TextInput
                    width="full"
                    type="text"
                    name="card_name"
                    id="card_name"
                    placeholder="Cardholder Name"
                    disabled={isLoading}
                    required={true}
                    className={`py-3 ${
                      hasError(errors, 'cardHolderName') ? 'error' : 'mb-10'
                    }`}
                    onChange={(e) => {
                      setCardHolderName(e.target.value)
                    }}
                  />
                  {hasError(errors, 'cardHolderName') && (
                    <p className="px-3 mt-1 text-xs text-red-150">
                      {getErrorMessage(errors, 'cardHolderName')}
                    </p>
                  )}
                  <CardSection errorMsg={cardError} />
                  <div className="flex items-center justify-start mb-10">
                    <img src="/images/Card-Visa.png" />
                    <img src="/images/Card-Master.png" className="ml-3" />
                    <img src="/images/Card-Express.png" className="ml-3" />
                  </div>
                </>
              )}
              {payAmount > 0 && (
                <div className="hidden w-full mb-10 sm:block">
                  <CheckboxGroup
                    label="Mailing list"
                    options={[
                      {
                        label:
                          'I agree to be added to the mailing list and understand that I may opt out at any time',
                        id: 'consent',
                        value: '',
                        name: 'consent',
                      },
                    ]}
                    disabled={isLoading}
                    valueProp={handleOnCheck}
                    hideLabel={true}
                  />
                </div>
              )}
              {!isLoading && (
                <>
                  {payAmount > 0 && (
                    <div className="grid items-center grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-10">
                      <div>
                        <TextInput
                          width="full"
                          type="text"
                          name="promo_code"
                          id="promo_code"
                          placeholder="Promo Code"
                          required={true}
                          className="py-3"
                          disabled={
                            isLoading || payAmount == 0 || promoCodes.length > 0
                          }
                          onChange={(e) => {
                            setPromoCodeInput(e.target.value)
                          }}
                        />
                      </div>
                      <div>
                        <button
                          onClick={applyPromoCode}
                          disabled={
                            isLoading || payAmount == 0 || promoCodes.length > 0
                          }
                          className="w-full px-6 py-3 ml-auto text-white bg-blue-850 font-mont hover:opacity-80 sm:text-lg font-bold"
                        >
                          Apply Promo Code
                        </button>
                      </div>
                    </div>
                  )}
                  {hasError(errors, 'promoCode') && (
                    <div className="grid items-center grid-cols-1 gap-6 mb-2 lg:grid-cols-2 lg:gap-10">
                      <p className="px-3 mt-1 text-xs text-red-150">
                        {getErrorMessage(errors, 'promoCode')}
                      </p>
                    </div>
                  )}
                  {promoCodes.length > 0 && (
                    <>
                      {promoCodes.map((item, index) => {
                        let pLabel = `Promo code # ${index + 1}: ${item.code}`
                        return (
                          <div
                            className="grid items-center grid-cols-1 gap-6 mb-1 lg:gap-10"
                            key={index}
                          >
                            <div className="flex items-center justify-between pt-2 mb-1">
                              <Text text={pLabel} />
                            </div>
                          </div>
                        )
                      })}
                    </>
                  )}
                  {hasError(errors, 'general') && (
                    <div className="grid items-center grid-cols-1 gap-6 mt-5 mb-10 lg:gap-10">
                      <div className="justify-center mx-auto max-w-wrapper">
                        <p className="text-red-600">
                          {getErrorMessage(errors, 'general')}
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          <div
            className={
              payAmount > 0
                ? 'lg:col-span-2 order-box'
                : 'lg:col-span-5 order-box'
            }
          >
            <div className="p-4 bg-white lg:p-12 shadow-2">
              <Heading3
                heading="Order Summary"
                className="mb-10 text-center lg:text-left"
              />
              <div className="flex items-center justify-between mb-6">
                <Text text="Price: " />
                <Text text={`$ ${totalPrice}`} />
              </div>
              <div className="flex items-center justify-between pb-10 border-b-2 border-gray-75">
                <Text text="Promo Code: " />
                <Text text={`-$ ${promoPrice}`} />
              </div>
              <div className="flex items-center justify-between pt-10 mb-6">
                <Text text="Subtotal" />
                <Text text={`$ ${payAmount}`} />
              </div>
              <div className="flex items-center justify-between mb-6">
                <Heading3 heading="Total:" />
                <Heading3 heading={`$ ${payAmount}`} />
              </div>
              {payAmount === 0 && (
                <div className="hidden w-full mb-10 sm:block">
                  <CheckboxGroup
                    label="Mailing list"
                    options={[
                      {
                        label:
                          'I agree to be added to the mailing list and understand that I may opt out at any time',
                        id: 'consent',
                        value: '',
                        name: 'consent',
                      },
                    ]}
                    disabled={isLoading}
                    valueProp={handleOnCheck}
                    hideLabel={true}
                  />
                </div>
              )}
              {isLoading && <Loader message={loadingMsg} />}
              {!isLoading && (
                <>
                  <div>
                    <button
                      className="w-full px-6 py-3 ml-auto text-white bg-blue-850 font-mont hover:opacity-80 sm:text-lg font-bold"
                      onClick={completePayment}
                    >
                      Complete {initialAmount > 0 ? 'Payment' : 'Registration'}
                    </button>
                  </div>
                  <div>
                    <button
                      className="w-full px-6 py-3 mt-4 ml-auto text-white opacity-70 bg-blue-850 font-mont hover:opacity-80 sm:text-lg font-bold"
                      onClick={onPrevStep}
                    >
                      Go Back to Cart
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default StepPayment
