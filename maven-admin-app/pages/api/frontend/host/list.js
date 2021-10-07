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
    await faunaClient
      .query(
        q.Filter(
          q.Paginate(q.Match(q.Index('hosts')), { size: 100000 }),
          q.Lambda('i', q.Equals('active', q.Select(6, q.Var('i'))))
        )
      )
      .then((ret) => {
        const data = ret.data

        let hosts = []
        if (data.length > 0) {
          for (let index = 0; index < data.length; index++) {
            const host = data[index]

            // refer to hosts index to search for index of each field
            if (host[7] == 'yes') {
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
        res.status(422).json([{ key: 'general', values: err.description }])
        return
      })
  }
}

export default handler
