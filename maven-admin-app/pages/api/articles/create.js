import moment from 'moment'
import User from '../../../lib/models/user'
import Article from '../../../lib/models/article'
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
    let article = new Article(data)

    // Validate article input
    try {
      await article.validate()
    } catch (error) {
      res.status(422).json(error)
      return
    }

    let user = new User({})

    const currentUserRefNumber = session.user.id

    // update create and update details
    article.created_at = moment().format('YYYY-MM-DD HH:mm:ss')
    article.created_by = currentUserRefNumber
    article.updated_at = moment().format('YYYY-MM-DD HH:mm:ss')
    article.updated_by = currentUserRefNumber

    // save/update article
    try {
      return await faunaClient
        .query(
          q.Create(q.Collection('articles'), { data: article.getValues() })
        )
        .then((result) => {
          res.status(200).json({ message: 'Created article!' })
          return
        })
    } catch (error) {
      res.status(422).json([{ key: 'general', values: error.description }])
      return
    }
  }
}

export default handler
