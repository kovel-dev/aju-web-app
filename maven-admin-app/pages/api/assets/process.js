import moment from 'moment'
import formidable from 'formidable'
import User from '../../../lib/models/user'
import Asset from '../../../lib/models/asset'
import { query as q } from 'faunadb'
import { getSession } from 'next-auth/client'
import { faunaClient } from '../../../lib/config/fauna'

export const config = {
  api: {
    bodyParser: false,
  },
}

async function handler(req, res) {
  if (req.method == 'POST') {
    const session = await getSession({ req: req })

    let parseFile = null
    try {
      parseFile = new Promise((resolve, reject) => {
        const form = new formidable.IncomingForm()
        form.parse(req, async function (err, fields, files) {
          // check if parsing the incoming form has an error
          if (err) {
            reject([
              {
                key: 'form-parse-error',
                values:
                  'Sorry! Something went wrong parsing your files. Please try again later.',
              },
            ])
            return
          }

          // get the parsed file
          resolve(files.upload_file)
          return
        }) // end of formidable parse
      })
    } catch (error) {
      res.status(422).json(error)
      return
    }

    if (parseFile) {
      parseFile.then(async (parseFile) => {
        // connect and process to cloudinary
        let cloudinary = require('cloudinary').v2
        let cloudResult = null
        try {
          await cloudinary.uploader
            .upload(parseFile.path, {
              folder: moment().format('yyyy-MM-DD'),
              resource_type: 'auto',
            })
            .then((result) => {
              cloudResult = result
            })
        } catch (error) {
          res
            .status(422)
            .json([{ key: 'general-cloud', values: error.message }])
          return
        } // end of cloudinary trycatch

        try {
          // get current user
          let user = new User({})
          let currentUserRefNumber = session.user.id

          // inialize asset
          let newAsset = new Asset({
            name: parseFile.name,
            type: cloudResult.format,
            mime: parseFile.type,
            size: cloudResult.bytes,
            width: cloudResult.width,
            height: cloudResult.height,
            url: cloudResult.url,
            secure_url: cloudResult.secure_url,
            cloudinary_meta: cloudResult,
            folder: moment().format('yyyy-MM-DD'),
            created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
            created_by: currentUserRefNumber,
            updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
            updated_by: currentUserRefNumber,
          })

          await faunaClient
            .query(
              q.Create(q.Collection('assets'), { data: newAsset.getValues() })
            )
            .then((result) => {
              res.status(200).json({ message: 'Created assets!' })
              return
            })
        } catch (error) {
          res.status(422).json([{ key: 'general', values: error.description }])
          return
        }
      })
    } else {
      res.status(422).json([
        {
          key: 'general',
          values:
            'Sorry! Something went wrong getting your files. Please try again later.',
        },
      ])
      return
    } // end of checking the parse condition
  }
}

export default handler
