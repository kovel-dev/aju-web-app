import { query as q } from 'faunadb'
import { faunaClient } from '../../../lib/config/fauna'
import { getSession } from 'next-auth/client'

async function handler(req, res) {
  if (req.method == 'GET') {
    const session = await getSession({ req: req })

    if (!session) {
      res.status(401).json([{ key: 'general', values: 'Not Authenticated' }])
      return
    }

    await faunaClient
      .query(q.Paginate(q.Match(q.Index('products'))))
      .then((ret) => {
        const data = ret.data
        res.status(200).json(data)
        return
      })
      .catch((err) => {
        res.status(422).json([{ key: 'general', values: err.description }])
        return
      })
  }
}

export default handler
