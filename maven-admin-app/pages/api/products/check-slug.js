import { query as q } from 'faunadb'
import { faunaClient } from '../../../lib/config/fauna'
import { getSession } from 'next-auth/client'

async function handler(req, res) {
  if (req.method == 'POST') {
    const data = req.body
    const { slug } = data

    await faunaClient
      .query(q.Paginate(q.Match(q.Index('products_by_slug'), slug)))
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
