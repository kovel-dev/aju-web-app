import Cors from 'cors'
import corsMiddleware from '../../../../lib/middleware/cors'
import moment from 'moment'
import { query as q } from 'faunadb'
import { faunaClient } from '../../../../lib/config/fauna'
import { trimObj } from '../../../../lib/handlers/helper-handlers'
import { sendEmail } from '../../../../lib/mail/mail'
import Suggestion from '../../../../lib/models/suggestion'

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

    let model = new Suggestion(data)

    // Validate user input
    try {
      await model.validateFESuggestionForm()
    } catch (error) {
      res.status(422).json(error)
      return
    }

    let trimModal = trimObj(model)
    model = new Suggestion(trimModal)
    model.created_at = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')

    try {
      await faunaClient
        .query(
          q.Create(q.Collection('suggestions'), {
            data: model.getValues(),
          })
        )
        .then(async (result) => {
          if (process.env.IS_SEND_TO_ADMIN == 'true') {
            try {
              await sendEmail('fe-admin-suggestions', model.getValues())
            } catch (error) {
              // make a log process here to record error
            }
          }

          try {
            await sendEmail('fe-suggestions', model.getValues())
          } catch (error) {
            // make a log process here to record error
          }

          res.status(200).json('Suggestions Created!')
          return
        })
    } catch (error) {
      res.status(422).json([{ key: 'general', values: error.description }])
      return
    }
  }
}

export default handler
