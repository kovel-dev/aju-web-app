import Cors from 'cors'
import corsMiddleware from '../../../../lib/middleware/cors'
import { query as q } from 'faunadb'
import { faunaClient } from '../../../../lib/config/fauna'

// Initializing the cors middleware
const cors = corsMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    origin: [process.env.NEXT_PUBLIC_FRONTEND_API_URL],
    methods: ['GET'],
  })
)

async function handler(req, res) {
  // Run the middleware
  await cors(req, res)

  if (req.method == 'GET') {
    /**
     * @Ref: https://dev.to/pierb/getting-started-with-fql-faunadb-s-native-query-language-part-1-2069
     * @Ref: https://docs.fauna.com/fauna/current/tutorials/indexes/pagination.html?lang=javascript
     * */

    const count = await faunaClient.query(
      q.Count(q.Match(q.Index('organizations')))
    )

    const limit = parseInt(req.query.limit)
    const offset = limit * (parseInt(req.query.page) - 1)
    await faunaClient
      .query(
        q.Drop(
          offset,
          q.Paginate(q.Match(q.Index('organizations')), {
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
