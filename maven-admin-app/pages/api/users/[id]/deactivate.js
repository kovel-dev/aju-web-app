import moment from 'moment'
import User from '../../../../lib/models/user'
import { getSession } from 'next-auth/client'
import { query as q } from 'faunadb'
import { faunaClient } from '../../../../lib/config/fauna'

async function handler(req, res) {
  if (req.method == 'POST') {
    const session = await getSession({ req: req })

    if (!session) {
      res.status(401).json([{ key: 'general', values: 'Not Authenticated' }])
      return
    }

    const data = req.body
    let user = new User({})
    let currentUserRefNumber = null
    try {
      await user.getUserByEmail(session.user.email).then((result) => {
        currentUserRefNumber = result['ref'].id
      })
    } catch (error) {
      res.status(422).json([{ key: 'general', values: error.description }])
      return
    }

    const userRefNumber = req.query.id

    // get the current user

    currentUserRefNumber = session.user.id
    // update the user information
    data.updated_by = currentUserRefNumber
    data.updated_at = moment().format('YYYY-MM-DD HH:mm:ss')
    data.deleted_at = moment().format('YYYY-MM-DD HH:mm:ss')
    data.deleted_by = currentUserRefNumber
    await faunaClient
      .query(
        q.Update(q.Ref(q.Collection('users'), userRefNumber), { data: data })
      )
      .then((result) => {
        res.status(200).json([{ message: 'User updated!' }])
        return
      })
      .catch(async (err) => {
        res.status(422).json([{ key: 'general', values: err.description }])
        return
      })

    // ;
  }
}

export default handler
