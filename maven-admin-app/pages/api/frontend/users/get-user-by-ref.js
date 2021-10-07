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

  // check if you can verify the api token then do your process
  // else it's an invalid api token
  try {
    // Guide: https://nate-d-gage.medium.com/authentication-with-next-js-and-json-web-token-baf93ce7a63
    const apiToken = req.headers.authorization.replace('Bearer ', '')
    const payload = await jwt.decode({ token: apiToken, secret: secret })
  } catch (error) {
    res.status(401).json([{ key: 'general', values: 'Not Authenticated' }])
    return
  }

  if (req.method == 'POST') {
    const data = req.body
    const { ref } = data

    await faunaClient
      .query(q.Get(q.Ref(q.Collection('users'), ref)))
      .then(async (ret) => {
        const data = ret.data

        // remove sensitive data
        delete data.password
        delete data.old_password

        let userObj = data

        if (userObj.role == 'partner') {
          try {
            await faunaClient
              .query(q.Get(q.Match(q.Index('organizations_by_owner_id'), ref)))
              .then((retPartner) => {
                userObj['organization'] = retPartner.data
                userObj['organization']['id'] = retPartner.ref.id
              })
          } catch (error) {
            console.log('1', error)
            res
              .status(422)
              .json([{ key: 'general', values: error.description }])
            return
          }
        }

        res.status(200).json(userObj)
        return
      })
      .catch((err) => {
        res.status(422).json([{ key: 'general', values: err.description }])
        return
      })
  }
}

export default handler
