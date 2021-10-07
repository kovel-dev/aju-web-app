import { query as q } from 'faunadb'
import { getSession } from 'next-auth/client'
import { faunaClient } from '../../../lib/config/fauna'
import moment from 'moment-timezone'

async function handler(req, res) {
  if (req.method == 'POST') {
    /**
     * @Ref: https://dev.to/pierb/getting-started-with-fql-faunadb-s-native-query-language-part-1-2069
     * @Ref: https://docs.fauna.com/fauna/current/tutorials/indexes/pagination.html?lang=javascript
     * */

    const session = await getSession({ req: req })

    if (!session) {
      res.status(401).json([{ key: 'general', values: 'Not Authenticated' }])
      return
    }

    const { productId } = req.body

    const count = await faunaClient.query(
      q.Count(q.Match(q.Index('attendees_desc'), productId))
    )

    await faunaClient
      .query(
        q.Paginate(q.Match(q.Index('attendees_desc'), productId), {
          size: count,
        })
      )
      .then(async (result) => {
        let resultSet = result.data

        let newResultSet = []
        if (resultSet.length > 0) {
          for (let index = 0; index < resultSet.length; index++) {
            const attendee = resultSet[index]
            const userId = attendee[3]

            try {
              await faunaClient
                .query(q.Get(q.Ref(q.Collection('users'), userId)))
                .then((ret) => {
                  const userData = ret.data
                  attendee.push(userData.first_name + ' ' + userData.last_name)

                  const formattedCreatedAt = moment(attendee[0])
                    .local()
                    .format('YYYY-MM-DD hh:mm A')
                  attendee.push(formattedCreatedAt)

                  newResultSet.push(attendee)
                })
            } catch (error) {
              // @TODO: log error
            }
          }
        }

        res.status(200).json({ result: newResultSet, count })
        return
      })
      .catch(async (err) => {
        res.status(422).json([{ key: 'general', values: err.description }])
        return
      })
  }
}

export default handler
