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
    try {
      // Guide: https://nate-d-gage.medium.com/authentication-with-next-js-and-json-web-token-baf93ce7a63
      await faunaClient
        .query(q.Get(q.Match(q.Index('get_page_by_name'), 'faq')))
        .then((result) => {
          res.status(200).json(result.data.pageData)
          return
        })
    } catch (error) {
      res.status(422).json([{ key: 'general', values: error.description }])
      return
    }
  }
}

export default handler
