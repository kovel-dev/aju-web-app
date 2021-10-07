import Cors from 'cors'
import corsMiddleware from '../../../../lib/middleware/cors'
import { query as q } from 'faunadb'
import { faunaClient } from '../../../../lib/config/fauna'
import moment from 'moment'

// Initializing the cors middleware
const cors = corsMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    origin: [process.env.NEXT_PUBLIC_FRONTEND_API_URL],
    methods: ['GET'],
  })
)

async function handler(req, res) {
  await cors(req, res)

  if (req.method == 'GET') {
    /**
     * @Ref: https://dev.to/pierb/getting-started-with-fql-faunadb-s-native-query-language-part-1-2069
     * @Ref: https://docs.fauna.com/fauna/current/tutorials/indexes/pagination.html?lang=javascript
     * */

    let { keyword, limit, page } = req.query

    if (keyword == undefined || limit == undefined || page == undefined) {
      res.status(422).json([{ key: 'general', values: 'Invalid parameters' }])
      return
    }

    const count = await faunaClient.query(q.Count(q.Match(q.Index('products'))))

    limit = parseInt(limit)
    const offset = limit * (parseInt(page) - 1)
    const size = limit + offset

    const currentDT = moment
      .utc(moment().format('yyyy-MM-DD HH:mm:ss'))
      .valueOf()

    const resultCount = await faunaClient.query(
      q.Count(
        q.Filter(
          q.Paginate(q.Match(q.Index('products')), { size: count }),
          q.Lambda(
            'i',
            q.And(
              q.ContainsStr(
                q.Concat(
                  [
                    q.LowerCase(q.Select(0, q.Var('i'))),
                    q.LowerCase(q.Select(11, q.Var('i'))),
                    q.LowerCase(q.Select(12, q.Var('i'))),
                  ],
                  ' '
                ),
                q.LowerCase(keyword)
              ),
              q.LTE(q.Select(16, q.Var('i')), currentDT),
              q.GTE(q.Select(17, q.Var('i')), currentDT)
            )
          )
        )
      )
    )

    await faunaClient
      .query(
        q.Take(
          size,
          q.Drop(
            parseInt(offset),
            q.Filter(
              q.Paginate(q.Match(q.Index('products')), { size: count }),
              q.Lambda(
                'i',
                q.And(
                  q.ContainsStr(
                    q.Concat(
                      [
                        q.LowerCase(q.Select(0, q.Var('i'))),
                        q.LowerCase(q.Select(11, q.Var('i'))),
                        q.LowerCase(q.Select(12, q.Var('i'))),
                      ],
                      ' '
                    ),
                    q.LowerCase(keyword)
                  ),
                  q.LTE(q.Select(16, q.Var('i')), currentDT),
                  q.GTE(q.Select(17, q.Var('i')), currentDT)
                )
              )
            )
          )
        )
      )
      .then((result) => {
        let pageCount = Math.ceil(resultCount.data / limit)

        res.status(200).json({
          result: result.data,
          count,
          pageCount,
          resultCount: resultCount.data,
        })
        return
      })
      .catch(async (err) => {
        res.status(422).json([{ key: 'general', values: err.description }])
        return
      })
  }
}

export default handler
