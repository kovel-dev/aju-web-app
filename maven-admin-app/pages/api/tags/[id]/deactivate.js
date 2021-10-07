import moment from 'moment'
import User from '../../../../lib/models/user'
import Tag from '../../../../lib/models/tag'
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

    let user = new User({})
    const currentUserRefNumber = session.user.id

    const tagRefNumber = req.query.id
    let tag = new Tag({})

    try {
      await faunaClient
        .query(q.Get(q.Ref(q.Collection('tags'), tagRefNumber)))
        .then((ret) => {
          tag = new Tag(ret.data)
        })
    } catch (error) {
      res.status(422).json([{ key: 'general', values: error.description }])
      return
    }

    tag.status = 'inactive'
    tag.updated_at = moment().format('YYYY-MM-DD HH:mm:ss')
    tag.updated_by = currentUserRefNumber

    // save/update tag
    try {
      return await faunaClient
        .query(
          q.Update(q.Ref(q.Collection('tags'), req.query.id), {
            data: tag.getValues(),
          })
        )
        .then((result) => {
          res.status(200).json({ message: 'tag deactivated!' })
          return
        })
    } catch (error) {
      res.status(422).json([{ key: 'general', values: error.description }])
      return
    }
  }
}

export default handler
