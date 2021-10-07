import React, { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { Step } from '@components'
import { useRouter } from 'next/router'
import StepOrder from './cart-step/stepOrder'
import StepPayment from './cart-step/stepPayment'
import User from 'lib/models/user'
import Loader from '@components/loader'
import Cart from 'lib/models/cart'
import Question from 'lib/models/question'

//Initialize Stripe Promise
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY ?? ''
)

const stepNames = ['Order Summary', 'Payment Details', 'Confirmation']

const CartContainer = (props) => {
  let user = new User({})
  let cart = new Cart({})
  // variable to toggle loading gif
  const [isLoading, setIsLoading] = useState(true)
  // variable to toggle error message
  const [hasError, setHasError] = useState(false)
  // variable to containe the products in user's cart
  const [productsInCart, setProductsInCart] = useState([])
  // variable to hold the current process
  const [step, setStep] = useState(1)
  // variable to hold the user's record
  const [userState, setUserState] = useState(user.getValues(true))
  // variable to hold cart components
  const [stepComponents, setStepComponents] = useState([])
  // variable to hold the ticket count
  const [ticketCount, setTicketCount] = useState(0)
  // variable to hold the total
  const [total, setTotal] = useState(0)
  // variable to toggle error message
  const [errors, setErrors] = useState({})
  // varaible to hold questions based on cart items
  const [questions, setQuestions] = useState([])

  let router = useRouter()

  useEffect(() => {
    if (props.session) {
      getCurrentUser()
      getQuestions()
    } else {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (userState.cart_meta.length > 0) {
      setProductsInCart(userState.cart_meta)

      let newTicketCount = 0
      userState.cart_meta.map((item, index) => {
        newTicketCount += Number(item.quantity)
      })
      setTicketCount(newTicketCount)

      let newTotal = 0
      userState.cart_meta.map((item, index) => {
        newTotal += Number(item.total)
      })
      setTotal(newTotal)
    } else {
      setProductsInCart(userState.cart_meta)
      setTicketCount(0)
      setTotal(0)
    }

    getQuestions()
  }, [userState])

  useEffect(() => {
    if (productsInCart.length > 0) {
      setStepComponents([
        <div key={0} />,
        <StepOrder
          key={1}
          productsInCart={productsInCart}
          totalCount={ticketCount}
          totalPrice={total}
          onUpdateCart={handleUpdateCart}
          onNextStep={handleNextStep}
          errors={errors}
        />,
        // eslint-disable-next-line react/jsx-key
        <Elements stripe={stripePromise} key={2}>
          <StepPayment
            totalPrice={total}
            onNextStep={handleNextStep}
            onPrevStep={handlePrevStep}
            cartMeta={productsInCart}
            userId={props.session.user.id}
            questions={questions}
          />
        </Elements>,
      ])
    } else {
      setStepComponents([])
    }
  }, [productsInCart, errors, step])

  // get current user process
  const getCurrentUser = async () => {
    setIsLoading(true)

    // get user profile
    let userRes = null
    try {
      await user.getProfile().then((response) => {
        userRes = response
      })
    } catch (error) {
      console.log('user', error)
      setErrors(error)
      setHasError(true)
      setIsLoading(false)
    }

    if (userRes) {
      // initialize response data to user model to format data
      user = new User(userRes)
      // set user data to userState
      setUserState(user.getValues(true))
    }
    setIsLoading(false)
  }

  const getQuestions = async () => {
    setIsLoading(true)
    try {
      await Question.getQuestionsByCheckout().then((result) => {
        setQuestions(result.data)
        setIsLoading(false)
      })
    } catch (error) {
      console.log(error)
      setErrors(error)
      setIsLoading(false)
    }
  }

  const handleUpdateCart = async (product, count) => {
    setIsLoading(true)
    setErrors({})
    setHasError(false)

    // get user profile
    let userRes = null
    try {
      await cart.updateCart(product, count).then((response) => {
        userRes = response
      })
    } catch (error) {
      console.log('user-2', error)
      setErrors(error)
      setHasError(true)
      setIsLoading(false)
    }

    if (userRes) {
      // initialize response data to user model to format data
      user = new User(userRes)
      // set user data to userState
      setUserState(user.getValues(true))
    }
    setIsLoading(false)
  }

  const handleNextStep = (link = '') => {
    window.scrollTo(0, 0)
    if (link.length > 0) {
      router.replace(link)
    } else {
      const maxStepNum = stepNames.length
      const nextStep = step < maxStepNum ? step + 1 : step
      setStep(nextStep)
    }
  }

  const handlePrevStep = () => {
    window.scrollTo(0, 0)
    const prevStep = step === 0 ? step : step - 1
    setStep(prevStep)
  }

  return (
    <>
      {isLoading && <Loader message={'Loading...'} />}
      {productsInCart.length > 0 && !isLoading && (
        <div className="">
          <Step stepNames={stepNames} currentStep={step}>
            {stepComponents[step]}
          </Step>
        </div>
      )}
      {(productsInCart.length == 0 ||
        Object.keys(productsInCart).length == 0) &&
        !isLoading &&
        !hasError && (
          <div className="justify-center mx-auto max-w-wrapper">
            <p className="text-center">No item(s) found.</p>
          </div>
        )}
      {!isLoading && hasError && (
        <div className="justify-center mx-auto max-w-wrapper">
          <p className="text-center text-red-600">
            Ops! Sorry something went wrong getting the results.
          </p>
        </div>
      )}
    </>
  )
}

export default CartContainer
