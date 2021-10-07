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
    let attendeeProfiles = []
    try {
      await faunaClient
        .query(
          q.Map(
            q.Paginate(
              q.Match(q.Index('attendees_by_userId_status'), [userId, 'active'])
            ),
            q.Lambda('i', {
              productId: q.Select(['data', 'productId'], q.Get(q.Var('i'))),
              createdAt: q.Select(['data', 'created_at'], q.Get(q.Var('i'))),
            })
          )
        )
        .then((ret) => {
          ret.data.map((item, index) => {
            attendeeProfiles.push({
              productId: item.productId,
              createdAt: item.createdAt,
            })
          })
        })
    } catch (error) {
      res.status(422).json([{ key: 'general', values: error.description }])
      return
    }

    let formattedResult = []
    let upcomingPrograms = []
    let onDemandPrograms = []

    if (attendeeProfiles.length > 0) {
      // filter unique attendeeProfiles
      attendeeProfiles = [
        ...new Map(
          attendeeProfiles.map((item) => [item['productId'], item])
        ).values(),
      ]

      // loop all attendeeProfiles to get productProfile
      for (let index = 0; index < attendeeProfiles.length; index++) {
        const productId = attendeeProfiles[index].productId
        const createdAt = attendeeProfiles[index].createdAt

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
              // for on-demand
              const orderCreatedDt = moment
                .utc(createdAt)
                .add(48, 'hours')
                .format('YYYY-MM-DD HH:mm:ss')

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

                if (programProfile.type == 'on-demand') {
                  dateToCheck = moment(orderCreatedDt, 'YYYY-MM-DD HH:mm:ss')
                  shouldPushData = dateToCheck.isAfter(dateNow)
                }

                // format response data
                if (shouldPushData) {
                  let result = {
                    accountHolderName:
                      userProfile.first_name + ' ' + userProfile.last_name,
                    title: programProfile.name,
                    sponsor: programProfile.sponsorMeta,
                    millisecondStartDt: programProfile.millisecondStartDt,
                    link: `${process.env.NEXT_PUBLIC_FRONTEND_API_URL}/events-classes/program/${programProfile.slug}`,
                    img:
                      programProfile.imageUrl ||
                      `${process.env.NEXT_PUBLIC_FRONTEND_API_URL}/images/product-1.png`,
                    description: programProfile.shortDescription,
                    type: programProfile.type,
                    date: moment(dateStartDt).format('MMM DD'),
                    time: moment(dateStartDt).format('hh:mm A'),
                    month: moment(dateStartDt).format('MMM'),
                    day: moment(dateStartDt).format('DD'),
                    free: Number(programProfile.price) <= 0 ? true : false,
                  }

                  if (programProfile.type == 'on-demand') {
                    result['expires'] = {
                      date: moment(orderCreatedDt).format('MMM D'),
                      time: moment(orderCreatedDt).format('hh:mm A'),
                    }
                  }

                  formattedResult.push(result)
                }
              }
            })
        } catch (error) {
          // @TODO: log error
        }
      }

      if (formattedResult.length > 0) {
        upcomingPrograms = formattedResult
        onDemandPrograms = formattedResult.filter((item) => {
          return item.type == 'on-demand'
        })

        if (onDemandPrograms.length > 0) {
          onDemandPrograms = onDemandPrograms.sort(
            (a, b) => a.millisecondStartDt - b.millisecondStartDt
          )
        }

        if (upcomingPrograms.length > 0) {
          upcomingPrograms = upcomingPrograms.sort(
            (a, b) => a.millisecondStartDt - b.millisecondStartDt
          )
        }
      }
    }

    res.status(200).json({ upcomingPrograms, onDemandPrograms })
    return
  }
}

export default handler
