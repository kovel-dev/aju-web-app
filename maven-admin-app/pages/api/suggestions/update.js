import moment from 'moment'
import { getSession } from 'next-auth/client'
import { query as q } from 'faunadb'
import { faunaClient } from '../../../lib/config/fauna'
import jwt from 'next-auth/jwt'

async function handler(req, res) {
  let payload = null
  // check if you can verify the api token then do your process
  // else it's an invalid api token
  try {
    // get request token
    payload = await jwt.getToken({ req: req, secret: process.env.JWT_SECRET })
  } catch (error) {
    res.status(401).json([{ key: 'general', values: 'Not Authenticated' }])
    return
  }

  if (req.method == 'POST') {
    const session = await getSession({ req: req })

    const userId = payload.userRefID

    if (!session) {
      res.status(401).json([{ key: 'general', values: 'Not Authenticated' }])
      return
    }

    const data = req.body
    let { status, refId } = data

    let modelObj = null
    try {
      await faunaClient
        .query(q.Get(q.Ref(q.Collection('suggestions'), refId)))
        .then((result) => {
          modelObj = result
        })
    } catch (error) {
      res.status(422).json([{ key: 'general', values: error.description }])
      return
    }

    // update create and update details
    let newModelObjData = modelObj.data
    newModelObjData.status = status
    newModelObjData.updated_at = moment().format('YYYY-MM-DD HH:mm:ss')
    newModelObjData.updated_by = userId

    // save/update partner requests
    try {
      return await faunaClient
        .query(
          q.Update(q.Ref(q.Collection('suggestions'), refId), {
            data: newModelObjData,
          })
        )
        .then((result) => {
          res.status(200).json(result.data)
          return
        })
    } catch (error) {
      res.status(422).json([{ key: 'general', values: error.description }])
      return
    }
  }
}

export default handler
