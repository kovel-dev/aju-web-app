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
  const { programId, userId } = req.body
  if (req.method == 'POST') {
    let isOnWaitlist = await faunaClient
      .query(q.Get(q.Ref(q.Collection('users'), userId)))
      .then((ret) => {
        return ret.data.waitlist_meta.indexOf(programId) > -1
      })
      .catch((err) => {
        console.log(err, 'error')
        return false
      })

    return res.status(200).json(isOnWaitlist)
  }
}

export default handler
