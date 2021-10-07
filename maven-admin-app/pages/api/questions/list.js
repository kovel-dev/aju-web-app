import { query as q } from 'faunadb'
import { getSession } from 'next-auth/client'
import { faunaClient } from '../../../lib/config/fauna'

async function handler(req, res) {
  if (req.method == 'GET') {
    /**
     * @Ref: https://dev.to/pierb/getting-started-with-fql-faunadb-s-native-query-language-part-1-2069
     * @Ref: https://docs.fauna.com/fauna/current/tutorials/indexes/pagination.html?lang=javascript
     * */

    const session = await getSession({ req: req })

    if (!session) {
      res.status(401).json([{ key: 'general', values: 'Not Authenticated' }])
      return
    }
    const count = await faunaClient.query(
      q.Count(q.Match(q.Index('questions')))
    )

    const limit = parseInt(req.query.limit)
    const offset = limit * (parseInt(req.query.page) - 1)
    await faunaClient
      .query(
        q.Drop(
          offset,
          q.Paginate(q.Match(q.Index('questions')), {
            size: limit + offset,
          })
        )
      )
      .then((result) => {
        res.status(200).json({ result, count })
        return
      })
      .catch(async (err) => {
        res.status(422).json([{ key: 'general', values: err.description }])
        return
      })
  }
}

export default handler
