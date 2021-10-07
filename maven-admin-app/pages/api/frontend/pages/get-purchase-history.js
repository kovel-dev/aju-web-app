import Cors from 'cors'
import corsMiddleware from '../../../../lib/middleware/cors'
import { query as q } from 'faunadb'
import { faunaClient } from '../../../../lib/config/fauna'
import moment from 'moment-timezone'
import jwt from 'next-auth/jwt'

// Initializing the cors middleware
const cors = corsMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    origin: [process.env.NEXT_PUBLIC_FRONTEND_API_URL],
    methods: ['POST'],
  })
)

const secret = process.env.JWT_SECRET

async function handler(req, res) {
  // Run the middleware
  await cors(req, res)

  // check if you can verify the api token then do your process
  // else it's an invalid api token
  let payload = null
  try {
    // Guide: https://nate-d-gage.medium.com/authentication-with-next-js-and-json-web-token-baf93ce7a63
    const apiToken = req.headers.authorization.replace('Bearer ', '')
    payload = await jwt.decode({ token: apiToken, secret: secret })
  } catch (error) {
    res.status(401).json([{ key: 'general', values: 'Not Authenticated' }])
    return
  }

  if (req.method == 'POST') {
    const { startDt, endDt, status } = req.body

    if (startDt.length > 0 && endDt.length > 0) {
      let formattedStartDt = moment(startDt, 'YYYY-MM-DD HH:mm:ss')
      let formattedEndDt = moment(endDt, 'YYYY-MM-DD HH:mm:ss')

      if (!formattedEndDt.isSameOrAfter(formattedStartDt)) {
        res.status(422).json([{ key: 'general', values: 'Invalid Dates' }])
        return
      }
    }

    const userId = payload.userRefID

    // get userProfile by user Id
    let userProfile = null
    try {
      await faunaClient
        .query(q.Get(q.Ref(q.Collection('users'), userId)))
        .then(async (ret) => {
          userProfile = ret.data
        })
    } catch (error) {
      res.status(422).json([{ key: 'general', values: error.description }])
      return
    }

    // get all productIds where userId is equal to the user and status is active in attendees table
    let attendeesProfile = []
    try {
      await faunaClient
        .query(
          q.Map(
            q.Paginate(
              q.Match(q.Index('attendees_by_userId_status'), [userId, 'active'])
            ),
            q.Lambda('i', {
              productId: q.Select(['data', 'productId'], q.Get(q.Var('i'))),
              orderId: q.Select(['data', 'orderId'], q.Get(q.Var('i'))),
            })
          )
        )
        .then((ret) => {
          ret.data.map((item, index) => {
            attendeesProfile.push({
              productId: item.productId,
              orderId: item.orderId,
            })
          })
        })
    } catch (error) {
      res.status(422).json([{ key: 'general', values: error.description }])
      return
    }

    let formattedResult = []

    if (attendeesProfile.length > 0) {
      // loop all productIds to get productProfile
      for (let index = 0; index < attendeesProfile.length; index++) {
        const productId = attendeesProfile[index].productId
        const orderId = attendeesProfile[index].orderId

        try {
          await faunaClient
            .query(q.Get(q.Ref(q.Collection('products'), productId)))
            .then(async (ret) => {
              const programProfile = ret.data

              const dateStartDt = moment(programProfile.startDt).format(
                'YYYY-MM-DD HH:mm:ss'
              )
              let dateNow = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
              let dateToCheck = moment(dateStartDt, 'YYYY-MM-DD HH:mm:ss')
              let shouldPushData = false

              if (dateStartDt.length > 0) {
                if (startDt.length > 0 && endDt.length > 0) {
                  let formattedStartDt = moment(
                    startDt,
                    'YYYY-MM-DD HH:mm:ss'
                  ).startOf('day')
                  let formattedEndDt = moment(
                    endDt,
                    'YYYY-MM-DD HH:mm:ss'
                  ).endOf('day')

                  if (dateToCheck.isBetween(formattedStartDt, formattedEndDt)) {
                    shouldPushData = true
                  }
                } else if (status == 'upcoming') {
                  if (dateToCheck.isSameOrAfter(dateNow)) {
                    shouldPushData = true
                  }
                } else if (status == 'past') {
                  if (dateToCheck.isSameOrBefore(dateNow)) {
                    shouldPushData = true
                  }
                }

                // format response data
                if (shouldPushData) {
                  formattedResult.push({
                    accountHolderName:
                      userProfile.first_name + ' ' + userProfile.last_name,
                    // date: moment(dateStartDt).format('MMM D'),
                    date: moment(dateStartDt).format('MMMM DD, YYYY hh:mm A'),
                    time: moment(dateStartDt).format('hh:mm A'),
                    program: programProfile.name,
                    image:
                      programProfile.imageUrl ||
                      `${process.env.NEXT_PUBLIC_FRONTEND_API_URL}/images/product-1.png`,
                    sponsor: programProfile.sponsorMeta,
                    millisecondStartDt: programProfile.millisecondStartDt,
                    confirmationNumber: orderId,
                    link: `${process.env.NEXT_PUBLIC_FRONTEND_API_URL}/events-classes/program/${programProfile.slug}`,
                  })
                }
              }
            })
        } catch (error) {
          // @TODO: log error
        }
      }

      formattedResult = formattedResult.filter((item) => {
        return item.program !== undefined
      })

      // sort response data ASC
      if (formattedResult.length > 0) {
        formattedResult = formattedResult.sort(
          (a, b) => a.millisecondStartDt - b.millisecondStartDt
        )
      }
    }

    res.status(200).json(formattedResult)
    return
  }
}

export default handler
