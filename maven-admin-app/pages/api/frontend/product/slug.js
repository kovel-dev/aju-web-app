import Cors from 'cors'
import corsMiddleware from '../../../../lib/middleware/cors'
import { query as q } from 'faunadb'
import { faunaClient } from '../../../../lib/config/fauna'
import moment from 'moment'
import { server } from '../../../../lib/config/server'

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
  const { slug } = req.body
  console.log(`slug`, slug)
  if (req.method == 'POST') {
    let product = await faunaClient
      .query(
        q.Map(
          q.Paginate(q.Match(q.Index('products_by_slug'), slug)),
          q.Lambda(['ref'], q.Get(q.Var('ref')))
        )
      )
      .then((result) => {
        //Program Exist
        return result.data.length > 0 ? result.data[0] : false
      })
      .catch((err) => {
        console.log(err, 'err')
        return false
      })
    return res.status(200).json(product)
  }
}

export default handler
