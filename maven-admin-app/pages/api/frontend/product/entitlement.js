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
  const { programId, userId, type } = req.body
  if (req.method == 'POST') {
    let product = await faunaClient
      .query(
        q.Paginate(
          q.Match(q.Index('attendee_productid_userid_status'), [
            programId,
            userId,
            'active',
          ])
        )
      )
      .then((result) => {
        //Program Exist
        if (type == 'boolean') {
          return result.data.length > 0 ? true : false
        } else {
          return result.data.length > 0 ? Object.values(result.data[0]) : []
        }
      })
      .catch((err) => {
        console.log(err, 'err')
        return false
      })
    return res.status(200).json(product)
  }
}

export default handler
