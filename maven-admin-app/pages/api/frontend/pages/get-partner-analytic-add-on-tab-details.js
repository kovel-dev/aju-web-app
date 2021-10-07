import Cors from 'cors'
import corsMiddleware from '../../../../lib/middleware/cors'
import jwt from 'next-auth/jwt'
import { query as q } from 'faunadb'
import { faunaClient } from '../../../../lib/config/fauna'
import moment from 'moment-timezone'

// Initializing the cors middleware
const cors = corsMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    origin: [process.env.NEXT_PUBLIC_FRONTEND_API_URL],
    methods: ['POST'],
  })
)

const secret = process.env.JWT_SECRET

const sortProgramWithStartDtDesc = (arr) => {
  var sortable = []
  arr.map((item, index) => {
    sortable.push([item[0], item[1]])
  })

  return sortable.sort(function (a, b) {
    return b[1] - a[1]
  })
}

const processProgramReserved = async (userOrgProfile) => {
  // get product Ids following the condition where reserved to the partner, published, and isReserved is true
  let promoCodeIds = []
  let programReserved = []

  try {
    await faunaClient
      .query(
        q.Paginate(
          q.Match(q.Index('promo_codes_by_organization_meta'), [
            'active',
            userOrgProfile.id,
          ])
        )
      )
      .then((ret) => {
        promoCodeIds = ret.data
      })
  } catch (error) {
    // @TODO: log error
  }

  let programsIds = []
  if (promoCodeIds.length > 0) {
    for (let index = 0; index < promoCodeIds.length; index++) {
      const id = promoCodeIds[index].id

      // get the ids and milliseconds of start_dt
      try {
        await faunaClient
          .query(q.Get(q.Ref(q.Collection('promo_codes'), id)))
          .then((ret) => {
            ret.data.products_meta.map((item, index) => {
              programsIds.push(item.value)
            })
          })
      } catch (error) {
        // @TODO: log error
      }
    }
  }

  // process the productIds if not empty
  if (programsIds.length > 0) {
    let programs = []
    let programsWDetails = []

    // loop on each productIds to get the array of information
    // and array that will be used to sort the millisecondStartDt or StartDt
    for (let index = 0; index < programsIds.length; index++) {
      const id = programsIds[index]

      // get the ids and milliseconds of start_dt
      try {
        await faunaClient
          .query(q.Get(q.Ref(q.Collection('products'), id)))
          .then((ret) => {
            programs.push([id, ret.data.millisecondStartDt])

            let newProgramObj = ret.data
            newProgramObj['id'] = id
            programsWDetails.push(newProgramObj)
          })
      } catch (error) {
        // @TODO: log error
      }
    }

    // sort and process the products if not empty
    let sortedDescPrograms = []
    if (programs.length > 0) {
      // sort in descending order the program by millisecondStartDt
      // sortedDescPrograms [
      //   [ '307464518204654147', 1630022400000 ],
      //   [ '307463377000596037', 1629892800000 ]
      // ]
      sortedDescPrograms = sortProgramWithStartDtDesc(programs)

      let sortedProgramWDetails = []
      if (sortedDescPrograms.length > 0) {
        // after sorting get the program details via sorted program Ids
        sortedProgramWDetails = sortedDescPrograms.map((item, index) => {
          let newProgramObj = programsWDetails.filter((itemProgram, index) => {
            return itemProgram.id == item[0]
          })

          return newProgramObj[0]
        })
      }

      // after getting the program details, loop the program details to attached a new field: startDtByTimezone
      // the new field is the adjusted startDt of the event based on the timezone of the partner
      let sortedProgramWNewTimezone = []
      if (sortedProgramWDetails.length > 0) {
        sortedProgramWNewTimezone = sortedProgramWDetails.map((item, index) => {
          let newProgramObj = item
          newProgramObj['startDtByTimezone'] = moment(item.startDt).format(
            'YYYY-MM-DD | hh:mm A'
          )

          return newProgramObj
        })
      }

      // after adding the adjusted timezone in the program details
      // loop it again to get only the specific detail needed on the FE
      let formattedPrograms = []
      if (sortedProgramWNewTimezone.length > 0) {
        formattedPrograms = sortedProgramWNewTimezone.map((item, index) => {
          let formattedSponsor = []
          if (item.sponsorMeta.length > 0) {
            formattedSponsor = item.sponsorMeta.map((sponsor, index) => {
              return sponsor.label
            })
          }

          return {
            img: item.imageUrl,
            program: item.name,
            date: item.startDtByTimezone,
            sponsor:
              formattedSponsor.length > 0 ? formattedSponsor.join(', ') : '',
            link: `${process.env.NEXT_PUBLIC_FRONTEND_API_URL}/events-classes/program/${item.slug}`,
          }
        })
      }

      if (formattedPrograms.length > 0) {
        programReserved = formattedPrograms
      }
    }
  }

  return programReserved
}

const processProgramSponsored = async (userId, userOrgProfile) => {
  // get product Ids following the condition where reserved to the partner, published, and isReserved is true
  let programsIds = []
  let programSponsored = []

  try {
    await faunaClient
      .query(
        q.Paginate(
          q.Match(q.Index('products_by_sponsorMeta'), [
            'published',
            userOrgProfile.id,
          ])
        )
      )
      .then((ret) => {
        programsIds = ret.data
      })
  } catch (error) {
    // @TODO: log error
  }

  // process the productIds if not empty
  if (programsIds.length > 0) {
    let programs = []
    let programsWDetails = []

    // loop on each productIds to get the array of information
    // and array that will be used to sort the millisecondStartDt or StartDt
    for (let index = 0; index < programsIds.length; index++) {
      const id = programsIds[index].id

      // get the ids and milliseconds of start_dt
      try {
        await faunaClient
          .query(q.Get(q.Ref(q.Collection('products'), id)))
          .then((ret) => {
            programs.push([id, ret.data.millisecondStartDt])

            let newProgramObj = ret.data
            newProgramObj['id'] = id
            programsWDetails.push(newProgramObj)
          })
      } catch (error) {
        // @TODO: log error
      }
    }

    // sort and process the products if not empty
    let sortedDescPrograms = []
    if (programs.length > 0) {
      // sort in descending order the program by millisecondStartDt
      // sortedDescPrograms [
      //   [ '307464518204654147', 1630022400000 ],
      //   [ '307463377000596037', 1629892800000 ]
      // ]
      sortedDescPrograms = sortProgramWithStartDtDesc(programs)

      let sortedProgramWDetails = []
      if (sortedDescPrograms.length > 0) {
        // after sorting get the program details via sorted program Ids
        sortedProgramWDetails = sortedDescPrograms.map((item, index) => {
          let newProgramObj = programsWDetails.filter((itemProgram, index) => {
            return itemProgram.id == item[0]
          })

          return newProgramObj[0]
        })
      }

      // after getting the program details, loop the program details to attached a new field: startDtByTimezone
      // the new field is the adjusted startDt of the event based on the timezone of the partner
      let sortedProgramWNewTimezone = []
      if (sortedProgramWDetails.length > 0) {
        sortedProgramWNewTimezone = sortedProgramWDetails.map((item, index) => {
          let newProgramObj = item
          newProgramObj['startDtByTimezone'] = moment(item.startDt).format(
            'YYYY-MM-DD | hh:mm A'
          )

          return newProgramObj
        })
      }

      // after adding the adjusted timezone in the program details
      // loop it again to get only the specific detail needed on the FE
      let formattedPrograms = []
      if (sortedProgramWNewTimezone.length > 0) {
        formattedPrograms = sortedProgramWNewTimezone.map((item, index) => {
          let formattedSponsor = []
          if (item.sponsorMeta.length > 0) {
            formattedSponsor = item.sponsorMeta.map((sponsor, index) => {
              return sponsor.label
            })

            return {
              img: item.imageUrl,
              program: item.name,
              date: item.startDtByTimezone,
              sponsor:
                formattedSponsor.length > 0 ? formattedSponsor.join(', ') : '',
              link: `${process.env.NEXT_PUBLIC_FRONTEND_API_URL}/events-classes/program/${item.slug}`,
            }
          }
        })
      }

      if (formattedPrograms.length > 0) {
        programSponsored = formattedPrograms
      }
    }
  }

  return programSponsored
}

const processProgramPurchasedInFull = async (userId, userOrgProfile) => {
  // get product Ids following the condition where reserved to the partner, published, and isReserved is true
  let programsIds = []
  let programPurchasedInFull = []

  try {
    await faunaClient
      .query(
        q.Paginate(
          q.Match(q.Index('products_by_reservedBy'), [
            userId,
            'yes',
            'published',
          ])
        )
      )
      .then((ret) => {
        programsIds = ret.data
      })
  } catch (error) {
    // @TODO: log error
  }

  // process the productIds if not empty
  if (programsIds.length > 0) {
    let programs = []
    let programsWDetails = []

    // loop on each productIds to get the array of information
    // and array that will be used to sort the millisecondStartDt or StartDt
    for (let index = 0; index < programsIds.length; index++) {
      const id = programsIds[index].id

      // get the ids and milliseconds of start_dt
      try {
        await faunaClient
          .query(q.Get(q.Ref(q.Collection('products'), id)))
          .then((ret) => {
            programs.push([id, ret.data.millisecondStartDt])

            let newProgramObj = ret.data
            newProgramObj['id'] = id
            programsWDetails.push(newProgramObj)
          })
      } catch (error) {
        // @TODO: log error
      }
    }

    // sort and process the products if not empty
    let sortedDescPrograms = []
    if (programs.length > 0) {
      // sort in descending order the program by millisecondStartDt
      // sortedDescPrograms [
      //   [ '307464518204654147', 1630022400000 ],
      //   [ '307463377000596037', 1629892800000 ]
      // ]
      sortedDescPrograms = sortProgramWithStartDtDesc(programs)

      let sortedProgramWDetails = []
      if (sortedDescPrograms.length > 0) {
        // after sorting get the program details via sorted program Ids
        sortedProgramWDetails = sortedDescPrograms.map((item, index) => {
          let newProgramObj = programsWDetails.filter((itemProgram, index) => {
            return itemProgram.id == item[0]
          })

          return newProgramObj[0]
        })
      }

      // after getting the program details, loop the program details to attached a new field: startDtByTimezone
      // the new field is the adjusted startDt of the event based on the timezone of the partner
      let sortedProgramWNewTimezone = []
      if (sortedProgramWDetails.length > 0) {
        sortedProgramWNewTimezone = sortedProgramWDetails.map((item, index) => {
          let newProgramObj = item
          newProgramObj['startDtByTimezone'] = moment(item.startDt).format(
            'YYYY-MM-DD | hh:mm A'
          )

          return newProgramObj
        })
      }

      // after adding the adjusted timezone in the program details
      // loop it again to get only the specific detail needed on the FE
      let formattedPrograms = []
      if (sortedProgramWNewTimezone.length > 0) {
        formattedPrograms = sortedProgramWNewTimezone.map((item, index) => {
          let formattedSponsor = []
          if (item.sponsorMeta.length > 0) {
            formattedSponsor = item.sponsorMeta.map((sponsor, index) => {
              return sponsor.label
            })
          }

          return {
            img: item.imageUrl,
            program: item.name,
            date: item.startDtByTimezone,
            sponsor:
              formattedSponsor.length > 0 ? formattedSponsor.join(', ') : '',
            link: `${process.env.NEXT_PUBLIC_FRONTEND_API_URL}/events-classes/program/${item.slug}`,
          }
        })
      }

      if (formattedPrograms.length > 0) {
        programPurchasedInFull = formattedPrograms
      }
    }
  }

  return programPurchasedInFull
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
    // get the current userId, this userId should belong to a partner
    const userId = payload.userRefID

    // get the organization profile of the partner using userId
    let userOrgProfile = null
    try {
      await faunaClient
        .query(q.Get(q.Match(q.Index('organizations_by_owner_id'), userId)))
        .then((ret) => {
          userOrgProfile = ret.data
          userOrgProfile['id'] = ret.ref.id
        })
    } catch (error) {
      res.status(422).json([{ key: 'general', values: error.description }])
      return
    }

    // Classes and events I have purchased in full
    let programPurchasedInFull = {
      title: 'Classes and events I have purchased in full',
      items: [],
    }
    try {
      await processProgramPurchasedInFull(userId, userOrgProfile).then(
        (result) => {
          programPurchasedInFull.items = result
        }
      )
    } catch (error) {
      // @TODO: log error
    }

    // Classes and events I have sponsored
    let programSponsored = {
      title: 'Classes and events I have sponsored',
      items: [],
    }
    try {
      await processProgramSponsored(userId, userOrgProfile).then((result) => {
        programSponsored.items = result
      })
    } catch (error) {
      // @TODO: log error
    }

    let programReserved = {
      title: 'Classes and Events I have purchased a set amount of seats for',
      items: [],
    }
    try {
      await processProgramReserved(userOrgProfile).then((result) => {
        programReserved.items = result
      })
    } catch (error) {
      // @TODO: log error
    }

    // userRefID
    res
      .status(200)
      .json({ programPurchasedInFull, programSponsored, programReserved })
    return
  }
}

export default handler
