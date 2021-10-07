import moment from 'moment'
import User from '../../../../lib/models/user'
import Asset from '../../../../lib/models/asset'
import { getSession } from 'next-auth/client'
import { query as q } from 'faunadb'
import { faunaClient } from '../../../../lib/config/fauna'
import { validateAssetForm } from '../../../../lib/validations/asset-validations'

async function handler(req, res) {
  if (req.method == 'POST') {
    const session = await getSession({ req: req })

    if (!session) {
      res.status(401).json([{ key: 'general', values: 'Not Authenticated' }])
      return
    }

    let cloudinary = require('cloudinary').v2
    const data = req.body

    let asset = new Asset(data.value)

    const enteredData = asset.getValues()

    cloudinary.api.update(
      data.value.cloudinary_meta.public_id,
      {
        context: 'alt=' + data.value.altTag + '|caption=' + data.value.name,
      },
      async function (error, result) {
        if (result) {
          // update asset alt tag
          enteredData.cloudinary_meta['context'] = result.context
          try {
            return await faunaClient.query(
              q.Update(q.Ref(q.Collection('assets'), data.refNumber), {
                data: enteredData,
              })
            )
          } catch (error) {
            res
              .status(422)
              .json([{ key: 'general', values: error.description }])
            return
          }
        }
      }
    )
    res.status(200).json({ message: 'Call Successfull' })
    return
  }
}

export default handler
