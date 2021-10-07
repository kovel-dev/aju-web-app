import Cors from 'cors'
import corsMiddleware from '../../../../lib/middleware/cors'
import moment from 'moment'
import jwt from 'next-auth/jwt'
import PartnerRequest from '../../../../lib/models/partner-request'
import { query as q } from 'faunadb'
import { faunaClient } from '../../../../lib/config/fauna'
import { trimObj } from '../../../../lib/handlers/helper-handlers'
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
  // Run the middleware
  await cors(req, res)

  let payload = null
  // check if you can verify the api token then do your process
  // else it's an invalid api token
  try {
    // Guide: https://nate-d-gage.medium.com/authentication-with-next-js-and-json-web-token-baf93ce7a63
    const apiToken = req.headers.authorization.replace('Bearer ', '')
    payload = await jwt.decode({ token: apiToken, secret: secret })
  } catch (error) {
    res.status(401).json([{ key: 'general', values: 'Not Authenticatedxsss' }])
    return
  }

  if (req.method == 'POST') {
    const data = req.body

    const userId = payload.userRefID

    let model = new PartnerRequest(data)

    // Validate user input
    try {
      await model.validateFEPartnerRequestForm()
    } catch (error) {
      res.status(422).json(error)
      return
    }

    let trimModal = trimObj(model)
    model = new PartnerRequest(trimModal)
    model.created_at = moment().format('YYYY-MM-DD HH:mm:ss')
    model.created_by = userId

    try {
      await faunaClient
        .query(
          q.Create(q.Collection('partner_requests'), {
            data: model.getValues(),
          })
        )
        .then(async (result) => {
          if (process.env.IS_SEND_TO_ADMIN == 'true') {
            try {
              await sendEmail('fe-admin-partner-request', model.getValues())
            } catch (error) {
              // make a log process here to record error
            }
          }

          try {
            await sendEmail('fe-partner-request', model.getValues())
          } catch (error) {
            // make a log process here to record error
          }

          res.status(200).json('Partner Requests Created!')
          return
        })
    } catch (error) {
      res.status(422).json([{ key: 'general', values: error.description }])
      return
    }
  }
}

export default handler
