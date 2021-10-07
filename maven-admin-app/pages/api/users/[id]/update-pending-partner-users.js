import moment from 'moment'
import User from '../../../../lib/models/user'
import { getSession } from 'next-auth/client'
import { query as q } from 'faunadb'
import { faunaClient } from '../../../../lib/config/fauna'
import { sendEmail } from '../../../../lib/mail/mail'

async function handler(req, res) {
  if (req.method == 'POST') {
    const session = await getSession({ req: req })

    if (!session) {
      res.status(401).json([{ key: 'general', values: 'Not Authenticated' }])
      return
    }

    let user = new User({})
    const data = req.body
    const currentUserRefNumber = session.user.id

    const userRefNumber = req.query.id
    const updated_at = moment().format('YYYY-MM-DD HH:mm:ss')
    if (data.type == 'approve') {
      try {
        await faunaClient
          .query(
            q.Call(
              q.Function('pending_partner_approve'),
              userRefNumber,
              currentUserRefNumber,
              updated_at
            )
          )
          .then(async (ret) => {
            user = new User(ret.data)
            //email send
            let hasSend = true
            let successMsg = { message: 'Created user!' }
            try {
              hasSend = await sendEmail('partner-verification', user)
            } catch (error) {
              console.log(error)
              hasSend = false
            }

            if (!hasSend) {
              console.log(
                'User created but failed to submit email verification.'
              )
              successMsg = {
                message:
                  'User created but failed to submit email verification.',
              }
            }
            user.verification_email_status = hasSend ? 'sent' : 'failed'
            user.updated_by = currentUserRefNumber
            user.updated_at = moment().format('YYYY-MM-DD HH:mm:ss')
          })
      } catch (error) {
        console.log(error, 'error')
        res.status(422).json([{ key: 'general', values: error.description }])
        return
      }
    }
    if (data.type == 'reject') {
      try {
        await faunaClient
          .query(
            q.Call(
              q.Function('pending_partner_reject'),
              userRefNumber,
              currentUserRefNumber,
              updated_at
            )
          )
          .then((ret) => {
            user = new User(ret.data)
          })
      } catch (error) {
        console.log(error, 'error')
        res.status(422).json([{ key: 'general', values: error.description }])
        return
      }
    }
    // save/update user
    try {
      return await faunaClient
        .query(
          q.Update(q.Ref(q.Collection('users'), userRefNumber), {
            data: user.getValues(),
          })
        )
        .then((result) => {
          res.status(200).json({ message: 'Partner Approved!' })
          return
        })
    } catch (error) {
      res.status(422).json([{ key: 'general', values: error.description }])
      return
    }
  }
}

export default handler
