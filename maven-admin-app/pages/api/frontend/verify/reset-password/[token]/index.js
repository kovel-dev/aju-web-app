import Cors from 'cors'
import corsMiddleware from '../../../../../../lib/middleware/cors'
import { query as q } from 'faunadb'
import { getSession } from 'next-auth/client'
import { faunaClient } from '../../../../../../lib/config/fauna'

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

  const session = await getSession({ req: req })

  if (session) {
    res.status(403).json([{ key: 'general', values: 'Forbidden' }])
    return
  }

  // get user model by token
  const token = req.query.token
  try {
    await faunaClient
      .query(q.Get(q.Match(q.Index('users_by_reset_password_token'), token)))
      .then(async (result) => {
        res.status(200).json([{ message: 'User can reset!' }])
        return
      })
  } catch (error) {
    res.status(422).json([
      {
        key: 'general',
        values: 'The reset password link has already been used or invalid.',
      },
    ])
    return
  }
}

export default handler
