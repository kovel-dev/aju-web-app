import moment from 'moment'
import User from '../../../lib/models/user'
import Host from '../../../lib/models/host'
import { getSession } from 'next-auth/client'
import { query as q } from 'faunadb'
import { faunaClient } from '../../../lib/config/fauna'

async function handler(req, res) {
  if (req.method == 'POST') {
    const session = await getSession({ req: req })

    if (!session) {
      res.status(401).json([{ key: 'general', values: 'Not Authenticated' }])
      return
    }

    const data = req.body
    let host = new Host(data)

    // Validate host input
    try {
      await host.validate()
    } catch (error) {
      res.status(422).json(error)
      return
    }

    let user = new User({})
    const currentUserRefNumber = session.user.id
    // update create and update details
    host.created_at = moment().format('YYYY-MM-DD HH:mm:ss')
    host.created_by = currentUserRefNumber
    host.updated_at = moment().format('YYYY-MM-DD HH:mm:ss')
    host.updated_by = currentUserRefNumber

    // save/update host
    try {
      return await faunaClient
        .query(q.Create(q.Collection('hosts'), { data: host.getValues() }))
        .then((result) => {
          res.status(200).json({ message: 'Created host!' })
          return
        })
    } catch (error) {
      res.status(422).json([{ key: 'general', values: error.description }])
      return
    }
  }
}

export default handler
