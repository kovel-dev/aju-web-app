import Cors from 'cors'
import corsMiddleware from '../../../../lib/middleware/cors'
import moment from 'moment'
import Newsletter from '../../../../lib/models/newsletter'
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

    let newsletter = new Newsletter(data)

    // Validate user input
    try {
      await newsletter.validateFENewsletterForm()
    } catch (error) {
      res.status(422).json(error)
      return
    }

    let trimModal = trimObj(newsletter)
    newsletter = new Newsletter(trimModal)
    newsletter.created_at = moment().format('YYYY-MM-DD HH:mm:ss')

    try {
      await faunaClient
        .query(
          q.Create(q.Collection('newsletters'), {
            data: newsletter.getValues(),
          })
        )
        .then(async (result) => {
          if (process.env.IS_SEND_TO_ADMIN == 'true') {
            try {
              await sendEmail('fe-admin-newsletter', newsletter.getValues())
            } catch (error) {
              // make a log process here to record error
            }
          }

          res.status(200).json('Newsletter Subscribed!')
          return
        })
    } catch (error) {
      res.status(422).json([{ key: 'general', values: error.description }])
      return
    }
  }
}

export default handler
