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

    const data = req.body
    let question = new Question(data)

    // Validate question input
    try {
      await question.validate()
    } catch (error) {
      res.status(422).json(error)
      return
    }

    let currentUserRefNumber = null
    try {
      await User.getUserByEmail(session.user.email).then((result) => {
        currentUserRefNumber = result['ref'].id
      })
    } catch (error) {
      res.status(422).json([{ key: 'general', values: error.description }])
      return
    }

    // update create and update details
    let newQuestionObj = question.getValues()

    if (newQuestionObj.type.indexOf('text') !== -1) {
      newQuestionObj.options = ''
    } else {
      newQuestionObj.options = newQuestionObj.options.trim()
    }
    newQuestionObj.updated_at = moment().format('YYYY-MM-DD HH:mm:ss')
    newQuestionObj.updated_by = currentUserRefNumber

    // save/update question
    try {
      return await faunaClient
        .query(
          q.Update(q.Ref(q.Collection('questions'), req.query.id), {
            data: newQuestionObj,
          })
        )
        .then((result) => {
          res.status(200).json({ message: 'Updated question!' })
          return
        })
    } catch (error) {
      res.status(422).json([{ key: 'general', values: error.description }])
      return
    }
  }
}

export default handler
