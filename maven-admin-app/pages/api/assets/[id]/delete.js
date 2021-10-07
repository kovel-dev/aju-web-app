import { getSession } from 'next-auth/client'
import { query as q } from 'faunadb'
import { faunaClient } from '../../../../lib/config/fauna'

async function handler(req, res) {
  if (req.method == 'DELETE') {
    const session = await getSession({ req: req })

    if (!session) {
      res.status(401).json([{ key: 'general', values: 'Not Authenticated' }])
      return
    }

    let publicId = null
    try {
      await faunaClient
        .query(q.Get(q.Ref(q.Collection('assets'), req.query.id)))
        .then((ret) => {
          const data = ret.data
          publicId = data.cloudinary_meta.public_id
        })
    } catch (error) {
      res.status(422).json([{ key: 'general', values: error.description }])
      return
    }

    // save/update product
    try {
      await faunaClient
        .query(q.Delete(q.Ref(q.Collection('assets'), req.query.id)))
        .then(async (result) => {
          if (publicId) {
            let cloudinary = require('cloudinary').v2
            try {
              await cloudinary.uploader
                .destroy(publicId)
                .then(async (result) => {
                  res.status(200).json({ message: 'Asset deleted!' })
                  return
                })
            } catch (error) {
              res.status(422).json([{ key: 'general', values: error.message }])
              return
            } // end of cloudinary trycatch
          }
        })
    } catch (error) {
      res.status(422).json([{ key: 'general', values: error.description }])
      return
    }
  }
}

export default handler
