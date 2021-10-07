import moment from 'moment'
import User from '../../../lib/models/user'
import { query as q } from 'faunadb'
import { faunaClient } from '../../../lib/config/fauna'
import { getSession } from 'next-auth/client'
import { sendEmail } from '../../../lib/mail/mail'
import { getToken } from '../../../lib/handlers/helper-handlers'

async function handler(req, res) {
  if (req.method == 'POST') {
    const session = await getSession({ req: req })

    if (!session) {
      res.status(401).json([{ key: 'general', values: 'Not Authenticated' }])
      return
    }

    const data = req.body
    const { email } = data
    const user = new User(data)
    const adminUserRefID = session.user.id

    // Validate user input
    try {
      await user.validate()
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
        user.verification_token = getToken()
        user.is_verified = false
        user.created_at = getToken()
        user.created_by = adminUserRefID

        try {
          await faunaClient.query(
            q.Create(q.Collection('users'), { data: user.getValues() })
          )
        } catch (error) {
          res.status(422).json([{ key: 'general', values: error.description }])
          return
        }

        // Send email verification
        let hasSend = true
        let successMsg = { message: 'Created user!' }
        try {
          hasSend = await sendEmail('user-verification', user)
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
