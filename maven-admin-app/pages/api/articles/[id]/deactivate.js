import moment from 'moment'
import User from '../../../../lib/models/user'
import Article from '../../../../lib/models/article'
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

    const articleRefNumber = req.query.id
    let article = new Article({})

    try {
      await faunaClient
        .query(q.Get(q.Ref(q.Collection('articles'), articleRefNumber)))
        .then((ret) => {
          article = new Article(ret.data)
        })
    } catch (error) {
      res.status(422).json([{ key: 'general', values: error.description }])
      return
    }

    article.status = 'inactive'
    article.updated_at = moment().format('YYYY-MM-DD HH:mm:ss')
    article.updated_by = currentUserRefNumber

    // save/update article
    try {
      return await faunaClient
        .query(
          q.Update(q.Ref(q.Collection('articles'), req.query.id), {
            data: article.getValues(),
          })
        )
        .then((result) => {
          res.status(200).json({ message: 'Article deactivated!' })
          return
        })
    } catch (error) {
      res.status(422).json([{ key: 'general', values: error.description }])
      return
    }
  }
}

export default handler
