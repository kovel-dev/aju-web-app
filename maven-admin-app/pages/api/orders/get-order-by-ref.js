import { query as q } from 'faunadb'
import { faunaClient } from '../../../lib/config/fauna'
import { getSession } from 'next-auth/client'
import moment from 'moment-timezone'

async function handler(req, res) {
  if (req.method == 'POST') {
    const session = await getSession({ req: req })

    if (!session) {
      res.status(401).json([{ key: 'general', values: 'Not Authenticated' }])
      return
    }

    const data = req.body
    const { ref } = data

    await faunaClient
      .query(q.Get(q.Ref(q.Collection('orders'), ref)))
      .then(async (ret) => {
        let orderData = ret.data
        orderData['id'] = ref

        try {
          await faunaClient
            .query(q.Get(q.Ref(q.Collection('users'), orderData.created_by)))
            .then((ret) => {
              const userData = ret.data
              orderData['created_by_name'] =
                userData.first_name + ' ' + userData.last_name

              const formattedCreatedAt = moment(orderData.created_at)
                .local()
                .format('YYYY-MM-DD HH:mm:ss')
              orderData['formatted_created_at'] = formattedCreatedAt
            })
        } catch (error) {
          // @TODO: log error
        }

        res.status(200).json(orderData)
        return
      })
      .catch((err) => {
        res.status(422).json([{ key: 'general', values: err.description }])
        return
      })
  }
}

export default handler
