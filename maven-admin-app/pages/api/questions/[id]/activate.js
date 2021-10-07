import moment from 'moment'
import User from '../../../../lib/models/user'
import Question from '../../../../lib/models/question'
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
    let currentUserRefNumber = null
    try {
      await user.getUserByEmail(session.user.email).then((result) => {
        currentUserRefNumber = result['ref'].id
      })
    } catch (error) {
      res.status(422).json([{ key: 'general', values: error.description }])
      return
    }

    const questionRefNumber = req.query.id
    let question = new Question({})

    try {
      await faunaClient
        .query(q.Get(q.Ref(q.Collection('questions'), questionRefNumber)))
        .then((ret) => {
          question = new Question(ret.data)
        })
    } catch (error) {
      res.status(422).json([{ key: 'general', values: error.description }])
      return
    }

    question.status = 'active'
    question.updated_at = moment().format('YYYY-MM-DD HH:mm:ss')
    question.updated_by = currentUserRefNumber

    // save/update question
    try {
      return await faunaClient
        .query(
          q.Update(q.Ref(q.Collection('questions'), req.query.id), {
            data: question.getValues(),
          })
        )
        .then((result) => {
          res.status(200).json({ message: 'Question activated!' })
          return
        })
    } catch (error) {
      res.status(422).json([{ key: 'general', values: error.description }])
      return
    }
  }
}

export default handler
