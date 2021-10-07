import moment from 'moment'
import User from '../../../../lib/models/user'
import Host from '../../../../lib/models/host'
import { getSession } from 'next-auth/client'
import { query as q } from 'faunadb'
import { faunaClient } from '../../../../lib/config/fauna'
import { validateHostForm } from '../../../../lib/validations/host-validations'

async function handler(req, res) {
  if (req.method == 'POST') {
    const session = await getSession({ req: req })

    if (!session) {
      res.status(401).json([{ key: 'general', values: 'Not Authenticated' }])
      return
    }

    const data = req.body
    let host = new Host(data)

    const enteredData = host.getValues()

    if (req.query) {
      const refNumber = req.query.id
      enteredData['id'] = refNumber
    }

    // Validate host input
    try {
      await validateHostForm(enteredData)
    } catch (error) {
      res.status(422).json(error)
      return
    }

    let user = new User({})
    const currentUserRefNumber = session.user.id

    // update create and update details
    host.updated_at = moment().format('YYYY-MM-DD HH:mm:ss')
    host.updated_by = currentUserRefNumber

    // save/update host
    try {
      return await faunaClient
        .query(
          q.Update(q.Ref(q.Collection('hosts'), req.query.id), {
            data: host.getValues(),
          })
        )
        .then((result) => {
          res.status(200).json({ message: 'Updated host!' })
          return
        })
    } catch (error) {
      res.status(422).json([{ key: 'general', values: error.description }])
      return
    }
  }
}

export default handler
