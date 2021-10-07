import Cors from 'cors'
import corsMiddleware from '../../../../lib/middleware/cors'
import { query as q } from 'faunadb'
import { getSession } from 'next-auth/client'
import { faunaClient } from '../../../../lib/config/fauna'
import moment from 'moment'

// Initializing the cors middleware
const cors = corsMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    origin: [process.env.NEXT_PUBLIC_FRONTEND_API_URL],
    methods: ['POST'],
  })
)

async function handler(req, res) {
  await cors(req, res)

  if (req.method == 'POST') {
    /**
     * @Ref: https://dev.to/pierb/getting-started-with-fql-faunadb-s-native-query-language-part-1-2069
     * @Ref: https://docs.fauna.com/fauna/current/tutorials/indexes/pagination.html?lang=javascript
     * */

    const data = req.body

    //Get Web URL
    const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_API_URL

    //Build params for Query
    let imgUrl = data.img

    if (!imgUrl) {
      return res
        .status(400)
        .json([{ key: 'error', values: 'No img URL to fetch data' }])
    }

    let assetData = await faunaClient
      .query(
        q.Map(
          q.Paginate(q.Match(q.Index('asset_by_url'), imgUrl)),
          q.Lambda(['ref'], q.Get(q.Var('ref')))
        )
      )
      .then((result) => {
        //Events found. Process Dates and price
        let data = {}
        data = result.data[0]
        return data
      })
      .catch((err) => {
        console.log(err, 'err')
        return false
      })

    res.status(200).json(assetData)
    return
  } else {
    return res.status(405).json([{ key: 'general', values: 'Invalid Call' }])
  }
}

export default handler
