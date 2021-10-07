import Cors from 'cors'
import moment from 'moment'
import corsMiddleware from '../../../../lib/middleware/cors'
import jwt from 'next-auth/jwt'
import { query as q } from 'faunadb'
import { faunaClient } from '../../../../lib/config/fauna'
import { sendEmail } from '../../../../lib/mail/mail'

// Initializing the cors middleware
const cors = corsMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    origin: [process.env.NEXT_PUBLIC_FRONTEND_API_URL],
    methods: ['POST'],
  })
)

const secret = process.env.JWT_SECRET

async function handler(req, res) {
  // let CORS check if the request is allowed
  await cors(req, res)
  let payload = null
  // check if you can verify the api token then do your process
  // else it's an invalid api token
  try {
    // Guide: https://nate-d-gage.medium.com/authentication-with-next-js-and-json-web-token-baf93ce7a63
    const apiToken = req.headers.authorization.replace('Bearer ', '')
    payload = await jwt.decode({ token: apiToken, secret: secret })
  } catch (error) {
    res.status(401).json([{ key: 'general', values: 'Not Authenticated' }])
    return
  }

  if (req.method == 'POST') {
    const data = req.body

    const userId = payload.userRefID

    // get productRefId, userRefId from request body
    let { slug } = data

    // get userProfile based on userRefId
    let userProfile = null
    await faunaClient
      .query(q.Get(q.Ref(q.Collection('users'), userId)))
      .then((ret) => {
        userProfile = ret
      })
      .catch((err) => {
        res.status(422).json([{ key: 'general', values: err.description }])
        return
      })

    // get ProductId based on productRefId
    let productProfile = null
    let productId = null
    await faunaClient
      .query(q.Get(q.Match(q.Index('products_by_slug'), slug)))
      .then((ret) => {
        productId = ret.ref.id
        productProfile = ret.data
      })
      .catch((err) => {
        res.status(422).json([{ key: 'general', values: err.description }])
        return
      })

    // get user data
    let userData = userProfile.data

    if (!userData.waitlist_meta) {
      userData['waitlist_meta'] = []
    }

    let waitListMeta = userData.waitlist_meta

    // get wishlist meta

    // check if wishlist cointains the productId
    // if productId is found then do nothing else add to the array
    if (waitListMeta.indexOf(productId) == -1) {
      waitListMeta.push(productId)

      userData.waitlist_meta = waitListMeta
      userData.updated_by = userId
      userData.updated_at = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    } else {
      res
        .status(422)
        .json([{ key: 'general', values: 'Already in the waitlist' }])
      return
    }

    // update the userProfile with added/updated waitlist
    try {
      await faunaClient
        .query(
          q.Update(q.Ref(q.Collection('users'), userId), { data: userData })
        )
        .then(async (result) => {
          let hasSend = true
          try {
            hasSend = await sendEmail('fe-join-waitlist', {
              user: userData,
              program: productProfile,
            })
          } catch (error) {
            hasSend = false
          }

          if (hasSend) {
            res.status(200).json('Added to the waitlist')
            return
          }
        })
    } catch (error) {
      res.status(422).json([{ key: 'general', values: error.description }])
      return
    }
  }
}

export default handler
