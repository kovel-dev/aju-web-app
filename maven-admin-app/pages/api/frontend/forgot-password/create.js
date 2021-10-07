import Cors from 'cors'
import corsMiddleware from '../../../../lib/middleware/cors'
import moment from 'moment'
import User from '../../../../lib/models/user'
import { query as q } from 'faunadb'
import { faunaClient } from '../../../../lib/config/fauna'
import { sendEmail } from '../../../../lib/mail/mail'
import { getToken } from '../../../../lib/handlers/helper-handlers'

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

    const { email } = data
    let currentUserRefNumber = null

    try {
      // If user has already been used, respond with error message
      await faunaClient
        .query(q.Get(q.Match(q.Index('users_by_email'), email)))
        .then(async (result) => {
          currentUserRefNumber = result['ref'].id

          let userRes = result.data

          if (userRes.status !== 'active') {
            res.status(200).json('Reset password created! [err3]')
          }

          userRes['reset_password_token'] = getToken()
          userRes.updated_by = currentUserRefNumber
          userRes.updated_at = moment().format('YYYY-MM-DD HH:mm:ss')

          // update user
          try {
            await faunaClient
              .query(
                q.Update(q.Ref(q.Collection('users'), currentUserRefNumber), {
                  data: userRes,
                })
              )
              .then(async (result) => {
                // Send email verification
                await sendEmail('fe-forgot-password-user', userRes)

                res.status(200).json('Reset password created!')
                return
              })
          } catch (error) {
            res.status(200).json('Reset password created! [err1]')
            return
          }
        })
    } catch (error) {
      res.status(200).json('Reset password created! [err2]')
      return
    }
  }
}

export default handler
