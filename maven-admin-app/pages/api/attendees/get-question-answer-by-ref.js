import { query as q } from 'faunadb'
import { faunaClient } from '../../../lib/config/fauna'
import { getSession } from 'next-auth/client'
import moment from 'moment-timezone'

async function handler(req, res) {
  if (req.method == 'POST') {
    const session = await getSession({ req: req })

    if (!session) {
      res.status(401).json([{ key: 'general', values: 'Not Authenticated' }])
      return
    }

    const data = req.body
    const { refId } = data

    await faunaClient
      .query(q.Get(q.Ref(q.Collection('attendees'), refId)))
      .then(async (ret) => {
        let attendeeProfile = ret.data
        let answerMeta = attendeeProfile.answerMeta

        let questionAnswerData = []
        for (const key in answerMeta) {
          if (Object.hasOwnProperty.call(answerMeta, key)) {
            const answer = answerMeta[key]

            try {
              await faunaClient
                .query(q.Get(q.Ref(q.Collection('questions'), key)))
                .then((ret) => {
                  const question = ret.data
                  questionAnswerData.push({
                    key: question.label,
                    value: answer,
                  })
                })
            } catch (error) {
              // @TODO: log error
            }
          }
        }

        questionAnswerData.unshift({
          key: 'QUESTION',
          value: 'ANSWER',
        })

        res.status(200).json(questionAnswerData)
        return
      })
      .catch((err) => {
        res.status(422).json([{ key: 'general', values: err.description }])
        return
      })
  }
}

export default handler
