import moment from 'moment'

import { getSession } from 'next-auth/client'
import { query as q } from 'faunadb'
import { faunaClient } from '../../../lib/config/fauna'

async function handler(req, res) {
  if (req.method == 'POST') {
    const session = await getSession({ req: req })

    if (!session) {
      res.status(401).json([{ key: 'general', values: 'Not Authenticated' }])
      return
    }

    const data = req.body
    let pageKey = data.page
    let pageData = data.pageData
    let pageRef = ''

    //check if page exist
    try {
      let pageReference = await faunaClient
        .query(q.Get(q.Match(q.Index('get_page_by_name'), pageKey)))
        .then((result) => {
          //Page Exist, Update current page
          return (pageRef = result.ref)
        })
      if (pageReference) {
        await faunaClient
          .query(q.Update(pageRef, { data: data }))
          .then((result) => {
            res
              .status(200)
              .json([{ success: true, msg: 'Page Updated successfully' }])
            return
          })
          .catch(async (err) => {
            res.status(422).json([{ success: false, msg: err.message }])
            return
          })
      }
    } catch (error) {
      if (error.requestResult.statusCode == 404) {
        //Page Does not exist, Create new document for this page
        try {
          await faunaClient.query(
            q.Create(q.Collection('pages'), { data: data })
          )
          res
            .status(200)
            .json([{ success: true, msg: 'Page Added successfully' }])
          return
        } catch (err) {
          res.status(422).json([{ success: false, msg: err.message }])
          return
        }
      } else {
        /**
         * @Note: Add file log for other error - err.description
         * We dont want to show the specific error especially FaunaDB error
         * */

        res.status(500).json([{ success: false, msg: error.message }])
        return
      }
    }
  }
}

export default handler
