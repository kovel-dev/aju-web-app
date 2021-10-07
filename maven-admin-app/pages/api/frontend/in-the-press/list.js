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
          q.Paginate(q.Match(q.Index('articles')), { size: 100000 }),
          q.Lambda('i', q.Equals('active', q.Select(5, q.Var('i'))))
        )
      )
      .then((ret) => {
        const data = ret.data

        let articles = []
        if (data.length > 0) {
          for (let index = 0; index < data.length; index++) {
            const article = data[index]

            // refer to articles index to search for index of each field
            if (article[7].length == 0) {
              articles.push({
                article: {
                  title: article[0],
                  quote: article[2],
                  content: article[1],
                  link: article[4],
                },
                image:
                  article[3] ||
                  `${process.env.NEXT_PUBLIC_FRONTEND_API_URL}/images/press.png`,
              })
            }
          }
        }

        res.status(200).json(articles)
        return
      })
      .catch((err) => {
        res.status(422).json([{ key: 'general', values: err.description }])
        return
      })
  }
}

export default handler
