import moment from 'moment'
import User from '../../../../lib/models/user'
import { query as q } from 'faunadb'
import { faunaClient } from '../../../../lib/config/fauna'
import { getSession } from 'next-auth/client'
import { sendEmail } from '../../../../lib/mail/mail'
import { getToken } from '../../../../lib/handlers/helper-handlers'

async function handler(req, res) {
  if (req.method == 'POST') {
    const session = await getSession({ req: req })

    if (!session) {
      res.status(401).json([{ key: 'general', values: 'Not Authenticated' }])
      return
    }

    const userRefNumber = req.query.id

    // get the current user
    const currentUserRefNumber = session.user.id

    let userProfile = null
    try {
      await faunaClient
        .query(q.Get(q.Ref(q.Collection('users'), userRefNumber)))
        .then((result) => {
          userProfile = result.data
          userProfile['id'] = result.ref.id
        })
    } catch (error) {
      res.status(422).json([{ key: 'general', values: error.description }])
      return
    }

    if (userProfile !== null) {
      userProfile.verification_token = getToken()
      userProfile.updated_by = currentUserRefNumber
      userProfile.updated_at = moment().format('YYYY-MM-DD HH:mm:ss')
      delete userProfile.id

      try {
        await faunaClient
          .query(
            q.Update(q.Ref(q.Collection('users'), userRefNumber), {
              data: userProfile,
            })
          )
          .then(async (result) => {
            userProfile['id'] = result.ref.id
          })
      } catch (error) {
        res.status(422).json([{ key: 'general', values: error.description }])
        return
      }

      // Send email verification
      let hasSend = true
      let successMsg = { message: 'Email verification resent!' }

      try {
        if (userProfile.role == 'student') {
          hasSend = await sendEmail('fe-user-verification', userProfile)
        } else if (userProfile.role == 'partner') {
          hasSend = await sendEmail('partner-verification', userProfile)
        } else {
          hasSend = await sendEmail('user-verification', userProfile)
        }
      } catch (error) {
        hasSend = false
      }

      if (!hasSend) {
        successMsg = {
          message: 'Resending email verification failed.',
        }
      }

      // add updated data
      userProfile.verification_email_status = hasSend ? 'sent' : 'failed'
      userProfile.updated_by = currentUserRefNumber
      userProfile.updated_at = moment().format('YYYY-MM-DD HH:mm:ss')
      delete userProfile.id

      // update user
      try {
        await faunaClient
          .query(
            q.Update(q.Ref(q.Collection('users'), userRefNumber), {
              data: userProfile,
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
    }
  }
}

export default handler
