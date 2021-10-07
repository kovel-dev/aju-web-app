import Cors from 'cors'
import corsMiddleware from '../../../../lib/middleware/cors'
import { query as q } from 'faunadb'
import { faunaClient } from '../../../../lib/config/fauna'

// Initializing the cors middleware
const cors = corsMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    origin: [process.env.NEXT_PUBLIC_FRONTEND_API_URL],
    methods: ['POST'],
  })
)

async function handler(req, res) {
  // Run the middleware
  await cors(req, res)

  if (req.method == 'POST') {
    let { categories, keyword } = req.body

    let query = q.Filter(
      q.Paginate(q.Match(q.Index('hosts')), { size: 100000 }),
      q.Lambda('i', q.Equals('active', q.Select(6, q.Var('i'))))
    )
    if (keyword.length > 0) {
      query = q.Filter(
        q.Paginate(q.Match(q.Index('hosts')), { size: 100000 }),
        q.Lambda(
          'i',
          q.ContainsStr(
            q.Concat(
              [
                q.LowerCase(q.Select(0, q.Var('i'))),
                q.LowerCase(q.Select(1, q.Var('i'))),
                q.LowerCase(
                  q.If(
                    q.IsNull(q.Select(2, q.Var('i'))),
                    '',
                    q.Select(2, q.Var('i'))
                  )
                ),
                q.LowerCase(
                  q.If(
                    q.IsNull(q.Select(5, q.Var('i'))),
                    '',
                    q.Select(5, q.Var('i'))
                  )
                ),
              ],
              ' '
            ),
            q.LowerCase(keyword)
          )
        )
      )
    }

    await faunaClient
      .query(query)
      .then((ret) => {
        const data = ret.data

        let hosts = []
        if (data.length > 0) {
          for (let index = 0; index < data.length; index++) {
            const host = data[index]
            const category = host[2]
            let hasCategory = true

            if (categories.length > 0) {
              hasCategory = categories.indexOf(category) > -1
            }

            if (host[6] == 'active' && hasCategory && host[7] == 'yes') {
              hosts.push({
                name: host[0],
                job: host[5],
                speaker: true,
                profile_image_url:
                  host[3] ||
                  `${process.env.NEXT_PUBLIC_FRONTEND_API_URL}/images/speaker-default.png`,
                bio: host[1],
                id: host[8].id,
              })
            }
          }
        }

        res.status(200).json(hosts)
        return
      })
      .catch((err) => {
        console.log(err)
        res.status(422).json([{ key: 'general', values: err.description }])
        return
      })
  }
}

export default handler
