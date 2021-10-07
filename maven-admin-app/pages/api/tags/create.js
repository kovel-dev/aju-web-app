import moment from 'moment'
import User from '../../../lib/models/user'
import Tag from '../../../lib/models/tag'
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
    let tag = new Tag(data)

    // Validate tag input
    try {
      await tag.validate()
    } catch (error) {
      res.status(422).json(error)
      return
    }

    const currentUserRefNumber = session.user.id

    // update create and update details
    tag.created_at = moment().format('YYYY-MM-DD HH:mm:ss')
    tag.created_by = currentUserRefNumber
    tag.updated_at = moment().format('YYYY-MM-DD HH:mm:ss')
    tag.updated_by = currentUserRefNumber

    // save/update tag
    try {
      return await faunaClient
        .query(q.Create(q.Collection('tags'), { data: tag.getValues() }))
        .then((result) => {
          res.status(200).json({ message: 'Created tag!' })
          return
        })
    } catch (error) {
      res.status(422).json([{ key: 'general', values: error.description }])
      return
    }
  }
}

export default handler
