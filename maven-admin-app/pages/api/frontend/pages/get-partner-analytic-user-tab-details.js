import Cors from 'cors'
import corsMiddleware from '../../../../lib/middleware/cors'
import jwt from 'next-auth/jwt'
import { query as q } from 'faunadb'
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

const secret = process.env.JWT_SECRET

const sortProgramWithCountDesc = (arr) => {
  var sortable = []
  arr.map((item, index) => {
    sortable.push([item[0], item[1]])
  })

  return sortable.sort(function (a, b) {
    return b[1] - a[1]
  })
}

const groupByKey = (array, key) => {
  return array.reduce((hash, obj) => {
    if (obj[key] === undefined) return hash
    return Object.assign(hash, {
      [obj[key]]: (hash[obj[key]] || []).concat(obj),
    })
  }, {})
}

async function handler(req, res) {
  // let CORS check if the request is allowed
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

  if (req.method == 'GET') {
    const userId = payload.userRefID

    let orgId = null
    try {
      await faunaClient
        .query(q.Get(q.Match(q.Index('organizations_by_owner_id'), userId)))
        .then((ret) => {
          orgId = ret.ref.id
        })
    } catch (error) {
      res.status(422).json([{ key: 'general', values: error.description }])
      return
    }

    // TOTAL NUMBER OF USERS AFFILIATED WITH MY ORGANIZATION
    let totalNumberOfUsersAffiliatedWithMyOrg = 0
    try {
      await faunaClient
        .query(q.Count(q.Match(q.Index('users_by_affiliation_id'), orgId)))
        .then((result) => {
          totalNumberOfUsersAffiliatedWithMyOrg = result
        })
    } catch (error) {
      // @TODO: log error
    }

    // TOTAL NUMBER OF NEW USER SIGN-UPS IN THE PAST 30 DAYS
    let totalNumberOfNewUserSignUpsInThePast30Days = 0
    try {
      await faunaClient
        .query(q.Paginate(q.Match(q.Index('users_by_affiliation_id'), orgId)))
        .then(async (result) => {
          // {
          //   data: [
          //     Ref(Collection("users"), "307099509349941829"),
          //     Ref(Collection("users"), "307100196208116292"),
          //     Ref(Collection("users"), "307279898837254725")
          //   ]
          // }
          let usersAffiliatedWithMyOrg = result.data

          // loop on each users record to get all the details
          // extract created_at only data for students only
          let createdDates = []
          for (
            let index = 0;
            index < usersAffiliatedWithMyOrg.length;
            index++
          ) {
            const item = usersAffiliatedWithMyOrg[index]
            try {
              await faunaClient
                .query(q.Get(q.Ref(q.Collection('users'), item.id)))
                .then((ret) => {
                  if (ret.data.role == 'student') {
                    createdDates.push(ret.data.created_at)
                  }
                })
            } catch (error) {
              // @TODO: log error
            }
          }

          // check each record of dates is within 30 days
          for (let index = 0; index < createdDates.length; index++) {
            const date = createdDates[index]

            if (date.length > 0) {
              let date30DaysBefore = moment()
                .subtract(30, 'days')
                .format('YYYY-MM-DD HH:mm:ss')
              let dateNow = moment().format('YYYY-MM-DD HH:mm:ss')
              let dateToCheck = moment(date, 'YYYY-MM-DD HH:mm:ss')

              if (dateToCheck.isBetween(date30DaysBefore, dateNow)) {
                totalNumberOfNewUserSignUpsInThePast30Days++
              }
            }
          }
        })
    } catch (error) {
      // @TODO: log error
    }

    // TOTAL NUMBER OF USER PURCHASES IN THE PAST 30 DAYS
    let totalNumberOfUserPurchasesInThePast30Days = 0
    try {
      await faunaClient
        .query(q.Paginate(q.Match(q.Index('users_by_affiliation_id'), orgId)))
        .then(async (result) => {
          // {
          //   data: [
          //     Ref(Collection("users"), "307099509349941829"),
          //     Ref(Collection("users"), "307100196208116292"),
          //     Ref(Collection("users"), "307279898837254725")
          //   ]
          // }
          let usersAffiliatedWithMyOrg = result.data

          // loop on each users record to get all the details
          // filter only users that is student and active
          let createdBys = []
          for (
            let index = 0;
            index < usersAffiliatedWithMyOrg.length;
            index++
          ) {
            const item = usersAffiliatedWithMyOrg[index]
            try {
              await faunaClient
                .query(q.Get(q.Ref(q.Collection('users'), item.id)))
                .then((ret) => {
                  if (
                    ret.data.role == 'student' &&
                    ret.data.status == 'active'
                  ) {
                    createdBys.push(item.id)
                  }
                })
            } catch (error) {
              // @TODO: log error
            }
          }

          // get all orders related to the users
          let orderIds = []
          for (let index = 0; index < createdBys.length; index++) {
            const id = createdBys[index]
            try {
              await faunaClient
                .query(
                  q.Paginate(q.Match(q.Index('orders_by_created_by'), id), {
                    size: 100000,
                  })
                )
                .then(async (ret) => {
                  ret.data.map((item, index) => {
                    orderIds.push(item.id)
                  })
                })
            } catch (error) {
              // @TODO: log error
            }
          }

          let usersFromOrder = []
          for (let index2 = 0; index2 < orderIds.length; index2++) {
            const id = orderIds[index2]
            try {
              await faunaClient
                .query(q.Get(q.Ref(q.Collection('orders'), id)))
                .then((ret) => {
                  if (ret.data.status == 'paid') {
                    const date = moment(ret.data.created_at)
                      .local()
                      .format('YYYY-MM-DD HH:mm:ss')

                    if (date.length > 0) {
                      let date30DaysBefore = moment()
                        .subtract(30, 'days')
                        .format('YYYY-MM-DD HH:mm:ss')
                      let dateNow = moment().format('YYYY-MM-DD HH:mm:ss')
                      let dateToCheck = moment(date, 'YYYY-MM-DD HH:mm:ss')

                      if (dateToCheck.isBetween(date30DaysBefore, dateNow)) {
                        // totalNumberOfUserPurchasesInThePast30Days++
                        usersFromOrder.push(ret.data.created_by)
                      }
                    }
                  }
                })
            } catch (error) {
              // @TODO: log error
            }
          }

          let uniqueUsersFromOrder = usersFromOrder.filter(function (
            item,
            pos
          ) {
            return usersFromOrder.indexOf(item) == pos
          })

          totalNumberOfUserPurchasesInThePast30Days =
            uniqueUsersFromOrder.length
        })
    } catch (error) {
      // @TODO: log error
    }

    // // Top classes and events users signed up for
    let topClassesAndEvents = []
    let numberOfRecordToExtract = 3
    try {
      await faunaClient
        .query(q.Paginate(q.Match(q.Index('users_by_affiliation_id'), orgId)))
        .then(async (result) => {
          // {
          //   data: [
          //     Ref(Collection("users"), "307099509349941829"),
          //     Ref(Collection("users"), "307100196208116292"),
          //     Ref(Collection("users"), "307279898837254725")
          //   ]
          // }
          let usersAffiliatedWithMyOrg = result.data

          // loop on each users record to get all the details
          // filter only users that is student and active
          let createdBys = []
          for (
            let index = 0;
            index < usersAffiliatedWithMyOrg.length;
            index++
          ) {
            const item = usersAffiliatedWithMyOrg[index]
            try {
              await faunaClient
                .query(q.Get(q.Ref(q.Collection('users'), item.id)))
                .then((ret) => {
                  if (
                    ret.data.role == 'student' &&
                    ret.data.status == 'active'
                  ) {
                    createdBys.push(item.id)
                  }
                })
            } catch (error) {
              // @TODO: log error
            }
          }

          // get all orders related to the users
          let orderIds = []
          for (let index = 0; index < createdBys.length; index++) {
            const id = createdBys[index]
            try {
              await faunaClient
                .query(
                  q.Paginate(q.Match(q.Index('orders_by_created_by'), id), {
                    size: 100000,
                  })
                )
                .then(async (ret) => {
                  ret.data.map((item, index) => {
                    orderIds.push(item.id)
                  })
                })
            } catch (error) {
              // @TODO: log error
            }
          }

          let arrOfProgram = []
          // [
          //   { program: '307026543906914885', user: '307100196208116292' },
          //   { program: '307026543906914885', user: '307100196208116292' },
          //   { program: '307463377000596037', user: '307279898837254725' },
          //   { program: '307026543906914885', user: '307279898837254725' },
          //   { program: '307026543906914885', user: '307279898837254725' },
          //   { program: '307463377000596037', user: '307279898837254725' }
          // ]
          for (let index2 = 0; index2 < orderIds.length; index2++) {
            const id = orderIds[index2]
            try {
              await faunaClient
                .query(q.Get(q.Ref(q.Collection('orders'), id)))
                .then((ret) => {
                  if (ret.data.status == 'paid') {
                    ret.data.items.map((item, index) => {
                      arrOfProgram.push({
                        program: item.productId,
                        user: ret.data.created_by,
                      })
                    })
                  }
                })
            } catch (error) {
              // @TODO: log error
            }
          }

          if (arrOfProgram.length > 0) {
            let groupedPrograms = groupByKey(arrOfProgram, 'program')
            // {
            //   '307026543906914885': [
            //     { program: '307026543906914885', user: '307100196208116292' },
            //     { program: '307026543906914885', user: '307100196208116292' },
            //     { program: '307026543906914885', user: '307279898837254725' },
            //     { program: '307026543906914885', user: '307279898837254725' }
            //   ],
            //   '307463377000596037': [
            //     { program: '307463377000596037', user: '307279898837254725' },
            //     { program: '307463377000596037', user: '307279898837254725' }
            //   ]
            // }

            let programsWithCount = []
            for (const key in groupedPrograms) {
              if (Object.hasOwnProperty.call(groupedPrograms, key)) {
                const item = groupedPrograms[key]

                let result = item.reduce((unique, o) => {
                  if (!unique.some((obj) => obj.user === o.user)) {
                    unique.push(o)
                  }
                  return unique
                }, [])

                programsWithCount.push([key, result.length])
              }
            }

            if (programsWithCount.length > 0) {
              // programsWithCount [ [ '307026543906914885', 2 ], [ '307463377000596037', 1 ] ]
              let sortedItems = sortProgramWithCountDesc(programsWithCount)
              let trimmedItems = sortedItems.slice(0, numberOfRecordToExtract)

              let itemObj = []
              for (let index = 0; index < trimmedItems.length; index++) {
                const item = trimmedItems[index]

                try {
                  await faunaClient
                    .query(q.Get(q.Ref(q.Collection('products'), item[0])))
                    .then((ret) => {
                      itemObj.push([ret.data.name, item[1]])
                    })
                } catch (error) {
                  // @TODO: log error
                }
              }

              topClassesAndEvents = itemObj
            }
          }
        })
    } catch (error) {
      // @TODO: log error
    }

    // userRefID
    res.status(200).json({
      totalNumberOfUsersAffiliatedWithMyOrg,
      totalNumberOfNewUserSignUpsInThePast30Days,
      totalNumberOfUserPurchasesInThePast30Days,
      topClassesAndEvents,
    })
    return
  }
}

export default handler
