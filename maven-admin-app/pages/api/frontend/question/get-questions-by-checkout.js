import Cors from 'cors'
import corsMiddleware from '../../../../lib/middleware/cors'
import { query as q } from 'faunadb'
import { faunaClient } from '../../../../lib/config/fauna'
import moment from 'moment-timezone'
import jwt from 'next-auth/jwt'

// Initializing the cors middleware
const cors = corsMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    origin: [process.env.NEXT_PUBLIC_FRONTEND_API_URL],
    methods: ['GET'],
  })
)

const secret = process.env.JWT_SECRET

async function handler(req, res) {
  // Run the middleware
  await cors(req, res)

  // check if you can verify the api token then do your process
  // else it's an invalid api token
  let payload = null
  try {
    // Guide: https://nate-d-gage.medium.com/authentication-with-next-js-and-json-web-token-baf93ce7a63
    const apiToken = req.headers.authorization.replace('Bearer ', '')
    payload = await jwt.decode({ token: apiToken, secret: secret })
  } catch (error) {
    res.status(401).json([{ key: 'general', values: 'Not Authenticated' }])
    return
  }

  if (req.method == 'GET') {
    // get the current userId
    const userId = payload.userRefID

    // get the user's profile
    let userProfile = null
    try {
      await faunaClient
        .query(q.Get(q.Ref(q.Collection('users'), userId)))
        .then((ret) => {
          userProfile = ret.data
          userProfile['id'] = ret.ref.id
        })
    } catch (error) {
      res.status(422).json([{ key: 'general', values: error.description }])
      return
    }

    // get all product Ids from cart_meta
    let result = []
    let cartMeta = userProfile.cart_meta
    let productIds = cartMeta.map((item, index) => {
      return item.productId
    })

    // loop each product Ids to get each product profile then get the list of question attached
    for (let index = 0; index < productIds.length; index++) {
      const productId = productIds[index]

      // get all question ids
      try {
        await faunaClient
          .query(q.Get(q.Ref(q.Collection('products'), productId)))
          .then(async (ret) => {
            let productProfile = ret.data
            if (productProfile.questionMeta.length > 0) {
              let questionMeta = productProfile.questionMeta
              let questions = []
              for (let index = 0; index < questionMeta.length; index++) {
                const question = questionMeta[index]
                let questionId = question.value

                try {
                  await faunaClient
                    .query(q.Get(q.Ref(q.Collection('questions'), questionId)))
                    .then((ret) => {
                      let questionProfile = ret.data
                      questionProfile['id'] = ret.ref.id
                      if (questionProfile.status == 'active') {
                        questions.push(questionProfile)
                      }
                    })
                } catch (error) {
                  // @TODO: log error
                }
              }

              result.push({
                programId: productId,
                programName: productProfile.name,
                questions: questions,
              })
            }
          })
      } catch (error) {
        res.status(422).json([{ key: 'general', values: error.description }])
        return
      }
    }

    // format and response
    res.status(200).json(result)
    return
  }
}

export default handler
