import { getSession } from 'next-auth/client'
import Stripe from 'stripe'

async function handler(req, res) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

  if (req.method === 'POST') {
    const session = await getSession({ req: req })

    // validate if user is authenticated
    if (!session) {
      res.status(401).json([{ key: 'general', values: 'Not Authenticated' }])
      return
    }

    //get payment amount from request
    try {
      const body = req.body
      let { amount, intentId } = body

      const payAmount = parseInt(amount, 10)
      const clientIntentId = intentId
      //ToDo: check if the user has a cart session and see if that has a payIntent already created.
      //If it exist, then use that payIntent to pay for the order.

      if (clientIntentId) {
        //Update the older PayIntent with new amount value
        //Stripe API call to update the existing Intent ID
        const paymentIntent = await stripe.paymentIntents.update(
          clientIntentId,
          {
            amount: payAmount * 100,
            currency: 'usd',
            // Verify your integration in this guide by including this parameter
            metadata: { integration_check: 'accept_a_payment' },
          }
        )
        res.status(200).json({
          intentId: paymentIntent.id,
          clientSecret: paymentIntent.client_secret,
        })
        return
      } else {
        //create a new payIntent
        //Stripe API call to create a new PayIntent.
        const paymentIntent = await stripe.paymentIntents.create({
          amount: payAmount * 100,
          currency: 'usd',
          // Verify your integration in this guide by including this parameter
          metadata: { integration_check: 'accept_a_payment' },
        })
        res.status(200).json({
          intentId: paymentIntent.id,
          clientSecret: paymentIntent.client_secret,
        })
      }
    } catch (e) {
      res.status(500).json({
        errorMsg: 'Something went wrong!!!',
        errorMsgDetails: e.message,
      })
      return
    }
  } else {
    res.status(401).send('Forbidden')
    return
  }
}

export default handler
