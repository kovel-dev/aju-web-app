import Cors from 'cors'
import corsMiddleware from '../../../../lib/middleware/cors'
import jwt from 'next-auth/jwt'
import { query as q } from 'faunadb'
import { faunaClient } from '../../../../lib/config/fauna'

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

    // payload example
    // {
    //   name: 'Carly',
    //   email: 'rabytakaza@mailinator.net',
    //   userRefID: '306206295279534660',
    //   userRole: 'student',
    //   userStatus: 'active',
    //   iat: 1629236612,
    //   exp: 1631828612
    // }
  } catch (error) {
    res.status(401).json([{ key: 'general', values: 'Not Authenticated' }])
    return
  }

  if (req.method == 'POST') {
    const data = req.body

    // get orderId, slug from request body
    let { orderId, slug } = data

    const userId = payload.userRefID

    // get userProfile.data based on userRefId
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

    // get orderObj based on orderId
    let orderObj = null
    try {
      await faunaClient
        .query(q.Get(q.Ref(q.Collection('orders'), orderId)))
        .then((ret) => {
          orderObj = ret
        })
    } catch (error) {
      res.status(422).json([{ key: 'general', values: error.description }])
      return
    }

    if (orderObj == null) {
      res.status(422).json([
        {
          key: 'general',
          values: 'Sorry! No Records Found.',
        },
      ])
      return
    } else if (orderObj.data.slug !== slug) {
      res.status(422).json([
        {
          key: 'general',
          values: "Sorry! Look like you're accessing an invalid link",
        },
      ])
      return
    } else {
      res.status(200).json({
        order: orderObj.data,
        user: {
          name: userProfile.data.first_name + ' ' + userProfile.data.last_name,
        },
      })
      return
    }
  }
}

export default handler
