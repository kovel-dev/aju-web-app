import moment from 'moment'
import User from '../../../lib/models/user'
import Organization from '../../../lib/models/organization'
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
    let organization = new Organization(data)

    // Validate Organization input
    try {
      await organization.validate()
    } catch (error) {
      res.status(422).json(error)
      return
    }

    let user = new User({})
    const currentUserRefNumber = session.user.id
    // update create and update details
    organization.created_at = moment().format('YYYY-MM-DD HH:mm:ss')
    organization.created_by = currentUserRefNumber
    organization.updated_at = moment().format('YYYY-MM-DD HH:mm:ss')
    organization.updated_by = currentUserRefNumber

    // save/update organization
    try {
      return await faunaClient
        .query(
          q.Create(q.Collection('organizations'), {
            data: organization.getValues(),
          })
        )
        .then((result) => {
          res.status(200).json({ message: 'Created organization!' })
          return
        })
    } catch (error) {
      res.status(422).json([{ key: 'general', values: error.description }])
      return
    }
  }
}

export default handler
