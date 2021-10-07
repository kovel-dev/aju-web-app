import Cors from 'cors'
import corsMiddleware from '../../../../lib/middleware/cors'
import moment from 'moment'
import User from '../../../../lib/models/user'
import { query as q } from 'faunadb'
import { faunaClient } from '../../../../lib/config/fauna'
import { sendEmail } from '../../../../lib/mail/mail'
import { getToken, trimObj } from '../../../../lib/handlers/helper-handlers'
import { hashPassword } from '../../../../lib/middleware/auth'

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
    const { email, password, confirm_password } = data

    let user = new User(data)

    // Validate user input
    try {
      await user.validateIndividualForm(password, confirm_password)
    } catch (error) {
      res.status(422).json(error)
      return
    }

    // Check if user is unique
    try {
      // If user has already been used, respond with error message
      await faunaClient
        .query(q.Get(q.Match(q.Index('users_by_email'), email)))
        .then((result) => {
          res
            .status(422)
            .json([
              { key: 'email', values: 'Sorry email has already been used!' },
            ])
          return
        })
    } catch (error) {
      if (error.requestResult.statusCode == 404) {
        // trim inputs by removing extra spaces
        let trimUser = trimObj(user)

        user = new User(trimUser)
        user.status = 'inactive'
        user.verification_token = getToken()
        user.verification_email_status = 'pending'
        user.is_verified = false
        user.created_at = moment().format('YYYY-MM-DD HH:mm:ss')
        user.updated_at = moment().format('YYYY-MM-DD HH:mm:ss')

        let newUserObj = user.getValues()
        newUserObj['password'] = await hashPassword(password)

        try {
          await faunaClient.query(
            q.Create(q.Collection('users'), { data: newUserObj })
          )
        } catch (error) {
          res.status(422).json([{ key: 'general', values: error.description }])
          return
        }

        // Send email verification
        let hasSend = true
        let successMsg = { message: 'Created user!' }
        try {
          await sendEmail('fe-user-verification', user.getValues()).then(
            (response) => {
              hasSend = response
            }
          )
        } catch (error) {
          hasSend = false
        }

        if (!hasSend) {
          successMsg = {
            message: 'User created but failed to submit email verification.',
          }
        }

        let currentUserRefNumber = null
        try {
          await User.getUserByEmail(email).then((result) => {
            currentUserRefNumber = result['ref'].id
          })
        } catch (error) {
          res.status(422).json([{ key: 'general', values: error.description }])
          return
        }

        // add updated data
        user.verification_email_status = hasSend ? 'sent' : 'failed'
        user.updated_by = currentUserRefNumber
        user.updated_at = moment().format('YYYY-MM-DD HH:mm:ss')

        // update user
        try {
          await faunaClient
            .query(
              q.Update(q.Ref(q.Collection('users'), currentUserRefNumber), {
                data: user.getValues(),
              })
            )
            .then(async (result) => {
              res.status(200).json(successMsg)
              return
            })
        } catch (error) {
          res.status(422).json([{ key: 'general', values: error.description }])
          return
        }
      } else {
        /**
         * @Note: Add file log for other error - err.description
         * We dont want to show the specific error especially FaunaDB error
         * */

        res.status(500).json([
          {
            key: 'general',
            values: 'Sorry but something went wrong processing your request!',
          },
        ])
        return
      }
    }
  }
}

export default handler
