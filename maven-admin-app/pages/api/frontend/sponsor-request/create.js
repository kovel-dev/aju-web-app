import Cors from 'cors'
import corsMiddleware from '../../../../lib/middleware/cors'
import moment from 'moment'
import SponsorRequest from '../../../../lib/models/sponsor-request'
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

async function handler(req, res) {
  // Run the middleware
  await cors(req, res)

  if (req.method == 'POST') {
    const data = req.body

    let model = new SponsorRequest(data)

    // Validate user input
    try {
      await model.validateFESponsorReqForm()
    } catch (error) {
      res.status(422).json(error)
      return
    }

    let trimModal = trimObj(model)
    model = new SponsorRequest(trimModal)
    model.created_at = moment().format('YYYY-MM-DD HH:mm:ss')

    try {
      await faunaClient
        .query(
          q.Create(q.Collection('sponsor_requests'), {
            data: model.getValues(),
          })
        )
        .then(async (result) => {
          if (process.env.IS_SEND_TO_ADMIN == 'true') {
            try {
              await sendEmail('fe-admin-sponsorship-req', model.getValues())
            } catch (error) {
              // make a log process here to record error
            }
          }

          try {
            await sendEmail('fe-sponsorship-req', model.getValues())
          } catch (error) {
            // make a log process here to record error
          }

          res.status(200).json('Sponsor Requests Created!')
          return
        })
    } catch (error) {
      res.status(422).json([{ key: 'general', values: error.description }])
      return
    }
  }
}

export default handler
