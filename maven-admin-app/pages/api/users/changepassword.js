import { query as q } from 'faunadb'
import { getSession } from 'next-auth/client'
import { faunaClient } from '../../../lib/config/fauna'
import { validatePassword } from '../../../lib/validations/validations'
import { hashPassword } from '../../../lib/middleware/auth'

async function handler(req, res) {
  const session = await getSession({ req: req })

  if (!session) {
    res.status(403).json([{ key: 'general', values: 'Forbidden' }])
    return
  }

  let userModel = null

  if (req.method == 'POST') {
    const password = req.body.newPassword
    const confirm_password = req.body.newPassword
    const userReference = req.body.userRefId

    if (!password || !userReference) {
      res
        .status(403)
        .json([{ key: 'general', values: 'Invalid Request method parameters' }])
    }

    // Make new password Hash after validation
    // validate password
    try {
      await validatePassword({ password, confirm_password })
    } catch (error) {
      res.status(422).json(error)
      return
    }

    let data = {}
    data.password = await hashPassword(password)
    // update user
    try {
      await faunaClient
        .query(
          q.Update(q.Ref(q.Collection('users'), userReference), { data: data })
        )
        .then(async (result) => {
          res.status(200).json({ message: 'Password updated successfully' })
          return
        })
    } catch (error) {
      res.status(422).json({ key: 'general', values: error.description })
      return
    }
  } else {
    console.log('no valid post method')
    res.status(403).json([{ key: 'general', values: 'Invalid Request method' }])
    return
  }
}

export default handler
