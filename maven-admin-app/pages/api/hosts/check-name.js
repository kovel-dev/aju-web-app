import { query as q } from 'faunadb'
import { faunaClient } from '../../../lib/config/fauna'
import { getSession } from 'next-auth/client'

async function handler(req, res) {
  if (req.method == 'POST') {
    const data = req.body
    const { name } = data

    await faunaClient
      .query(q.Paginate(q.Match(q.Index('hosts_by_name'), name)))
      .then((ret) => {
        res.status(200).json(ret)
        return
      })
      .catch((err) => {
        res.status(422).json([{ key: 'general', values: err.description }])
        return
      })
  }
}

export default handler
