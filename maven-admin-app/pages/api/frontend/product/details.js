import Cors from 'cors'
import corsMiddleware from '../../../../lib/middleware/cors'
import { query as q } from 'faunadb'
import { faunaClient } from '../../../../lib/config/fauna'
import Product from '../../../../lib/models/product'
import moment from 'moment'
import { getLanguagesOfCommunication } from '../../../../lib/handlers/dropdown-helpers'
import { formatOptions } from '../../../../lib/handlers/helper-handlers'

// Initializing the cors middleware
const cors = corsMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    origin: [process.env.NEXT_PUBLIC_FRONTEND_API_URL],
    methods: ['POST'],
  })
)

async function handler(req, res) {
  // Run the middleware
  await cors(req, res)

  if (req.method == 'POST') {
    let product = new Product({})
    let currentProductRefNumber = null
    let productResult = null
    let hostArray = []
    let seriesArray = []
    let attendeesArray = ['306469114506904131', '306206295279534660']
    const { id, userId } = req.body

    try {
      await faunaClient
        .query(q.Get(q.Match(q.Index('products_by_slug'), id)))
        .then(async (result) => {
          currentProductRefNumber = result['ref'].id
          productResult = result.data
          product = new Product(result.data)

          if (product.hostMeta.length > 0) {
            for (let index = 0; index < product.hostMeta.length; index++) {
              const host = product.hostMeta[index]
              try {
                await faunaClient
                  .query(q.Get(q.Ref(q.Collection('hosts'), host.value)))
                  .then((result) => {
                    hostArray.push(result.data)
                  })
              } catch (error) {
                res
                  .status(422)
                  .json([{ key: 'general', values: error.description }])
                return
              }
            }
          }
          if (product.seriesMeta.length > 0) {
            for (let index = 0; index < product.seriesMeta.length; index++) {
              const series = product.seriesMeta[index]
              try {
                seriesArray.push(series[0])
              } catch (error) {
                res
                  .status(422)
                  .json([{ key: 'general', values: error.description }])
                return
              }
            }
          }
          if (product.capacity <= 0) {
            product.class_full = true
          }
          if (attendeesArray.includes(userId)) {
            product.entitlement = true
          }

          let language = formatOptions(getLanguagesOfCommunication()).find(
            (o) => o.key === product.language
          )

          product.startDateTime = product.startDt
          product.startDt = moment
            .utc(moment(product.startDt))
            .format('MMM DD, YYYY')
          product.endDt = moment
            .utc(moment(product.endDt))
            .format('MMM DD, YYYY')
          product.startTime = moment.utc(moment(product.startDt)).format('LT')
          product.hostMeta = hostArray
          product.seriesMeta = seriesArray
          product.language = language ? language.value : ''
          product.purchaseDate = new Date('2021-08-17T21:27:52.769Z')
          product.refId = currentProductRefNumber
          res.status(200).json(product)
          return
        })
    } catch (error) {
      if (error.description == 'Set not found.') {
        res.status(200).json(product)
        return
      } else {
        res.status(500).json([{ key: 'error caught', value: error.message }])
        return
      }
    }
  }
}

export default handler
