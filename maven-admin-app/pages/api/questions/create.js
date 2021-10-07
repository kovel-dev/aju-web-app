import moment from 'moment'
import User from '../../../lib/models/user'
import Question from '../../../lib/models/question'
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
    let question = new Question(data)

    // Validate question input
    try {
      await question.validate()
    } catch (error) {
      res.status(422).json(error)
      return
    }

    let user = new User({})

    const currentUserRefNumber = session.user.id

    // update create and update details
    question.options = question.options.trim()
    question.created_at = moment().format('YYYY-MM-DD HH:mm:ss')
    question.created_by = currentUserRefNumber
    question.updated_at = moment().format('YYYY-MM-DD HH:mm:ss')
    question.updated_by = currentUserRefNumber

    // save/update question
    try {
      return await faunaClient
        .query(
          q.Create(q.Collection('questions'), { data: question.getValues() })
        )
        .then((result) => {
          res.status(200).json({ message: 'Created question!' })
          return
        })
    } catch (error) {
      res.status(422).json([{ key: 'general', values: error.description }])
      return
    }
  }
}

export default handler
