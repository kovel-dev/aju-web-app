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

const processTopicWithSearch = async (
  userOrgProfile,
  faunaIndex,
  searchKeyword
) => {
  let resultData = []
  try {
    await faunaClient
      .query(
        q.Filter(
          q.Paginate(q.Match(q.Index(faunaIndex)), {
            size: 100000,
          }),
          q.Lambda(
            'i',
            q.ContainsStr(
              q.Concat([q.LowerCase(q.Select(0, q.Var('i')))], ' '),
              q.LowerCase(searchKeyword)
            )
          )
        )
      )
      .then(async (result) => {
        let rawMaterials = result.data

        // remove duplicate
        let cleanMaterials = []
        if (rawMaterials.length > 0) {
          let seenIds = []

          for (let index = 0; index < rawMaterials.length; index++) {
            const sponsorMaterial = rawMaterials[index]
            let link = sponsorMaterial[1]
            let id = sponsorMaterial[2].id

            if (link !== null) {
              if (!seenIds.includes(id)) {
                seenIds.push(id)
                cleanMaterials.push(sponsorMaterial)
              }
            }
          }
        }

        // remove empty materials
        let filteredMaterials = []
        if (cleanMaterials.length > 0) {
          filteredMaterials = cleanMaterials.filter((item) => {
            return item[1] !== null
          })
        }

        if (filteredMaterials.length > 0) {
          for (let index = 0; index < filteredMaterials.length; index++) {
            const item = filteredMaterials[index]
            const productId = item[2].id

            await faunaClient
              .query(q.Get(q.Ref(q.Collection('products'), productId)))
              .then((ret) => {
                const data = ret.data

                resultData.push({
                  id: productId,
                  program: data.name,
                  date: moment(data.startDt).format('YYYY-MM-DD | hh:mm A'),
                  link: `${process.env.NEXT_PUBLIC_FRONTEND_API_URL}/events-classes/program/${data.slug}`,
                  materials: data.sponsorMaterialMeta,
                })
              })
              .catch((err) => {
                // @TODO: log error
              })
          }
        }
      })
  } catch (error) {
    return {
      status: false,
      data: [{ key: 'general', values: error.description }],
    }
  }

  return { status: true, data: resultData }
}

const processDateWithSearch = async (
  userOrgProfile,
  faunaIndex,
  searchKeyword
) => {
  let resultData = []
  try {
    await faunaClient
      .query(
        q.Filter(
          q.Paginate(q.Match(q.Index(faunaIndex)), {
            size: 100000,
          }),
          q.Lambda(
            'i',
            q.ContainsStr(
              q.Concat([q.LowerCase(q.Select(1, q.Var('i')))], ' '),
              q.LowerCase(searchKeyword)
            )
          )
        )
      )
      .then(async (result) => {
        let rawMaterials = result.data

        // remove duplicate
        let cleanMaterials = []
        if (rawMaterials.length > 0) {
          let seenIds = []

          for (let index = 0; index < rawMaterials.length; index++) {
            const sponsorMaterial = rawMaterials[index]
            let link = sponsorMaterial[2]
            let id = sponsorMaterial[3].id

            if (link !== null) {
              if (!seenIds.includes(id)) {
                seenIds.push(id)
                cleanMaterials.push(sponsorMaterial)
              }
            }
          }
        }

        // remove empty materials
        let filteredMaterials = []
        if (cleanMaterials.length > 0) {
          filteredMaterials = cleanMaterials.filter((item) => {
            return item[2] !== null
          })
        }

        if (filteredMaterials.length > 0) {
          for (let index = 0; index < filteredMaterials.length; index++) {
            const item = filteredMaterials[index]
            const productId = item[3].id

            await faunaClient
              .query(q.Get(q.Ref(q.Collection('products'), productId)))
              .then((ret) => {
                const data = ret.data

                resultData.push({
                  id: productId,
                  program: data.name,
                  date: moment(data.startDt).format('YYYY-MM-DD | hh:mm A'),
                  link: `${process.env.NEXT_PUBLIC_FRONTEND_API_URL}/events-classes/program/${data.slug}`,
                  materials: data.sponsorMaterialMeta,
                })
              })
              .catch((err) => {
                // @TODO: log error
              })
          }
        }
      })
  } catch (error) {
    return {
      status: false,
      data: [{ key: 'general', values: error.description }],
    }
  }

  return { status: true, data: resultData }
}

const processDateOrTopicOnly = async (userOrgProfile, faunaIndex) => {
  let resultData = []
  try {
    await faunaClient
      .query(q.Paginate(q.Match(q.Index(faunaIndex)), { size: 100000 }))
      .then(async (result) => {
        let rawMaterials = result.data

        // remove duplicate
        let cleanMaterials = []
        if (rawMaterials.length > 0) {
          let seenIds = []

          for (let index = 0; index < rawMaterials.length; index++) {
            const sponsorMaterial = rawMaterials[index]
            let link = sponsorMaterial[1]
            let id = sponsorMaterial[2].id

            if (link !== null) {
              if (!seenIds.includes(id)) {
                seenIds.push(id)
                cleanMaterials.push(sponsorMaterial)
              }
            }
          }
        }

        // remove empty materials
        let filteredMaterials = []
        if (cleanMaterials.length > 0) {
          filteredMaterials = cleanMaterials.filter((item) => {
            return item[1] !== null
          })
        }

        if (filteredMaterials.length > 0) {
          for (let index = 0; index < filteredMaterials.length; index++) {
            const item = filteredMaterials[index]
            const productId = item[2].id

            await faunaClient
              .query(q.Get(q.Ref(q.Collection('products'), productId)))
              .then((ret) => {
                const data = ret.data

                resultData.push({
                  id: productId,
                  program: data.name,
                  date: moment(data.startDt).format('YYYY-MM-DD | hh:mm A'),
                  link: `${process.env.NEXT_PUBLIC_FRONTEND_API_URL}/events-classes/program/${data.slug}`,
                  materials: data.sponsorMaterialMeta,
                })
              })
              .catch((err) => {
                // @TODO: log error
              })
          }
        }
      })
  } catch (error) {
    return {
      status: false,
      data: [{ key: 'general', values: error.description }],
    }
  }

  return { status: true, data: resultData }
}

const processSearchOnly = async (userOrgProfile, searchKeyword) => {
  let resultData = []
  try {
    await faunaClient
      .query(
        q.Filter(
          q.Paginate(q.Match(q.Index('sponsorMaterialMeta_sort_topic_asc')), {
            size: 100000,
          }),
          q.Lambda(
            'i',
            q.ContainsStr(
              q.Concat([q.LowerCase(q.Select(0, q.Var('i')))], ' '),
              q.LowerCase(searchKeyword)
            )
          )
        )
      )
      .then(async (result) => {
        let rawMaterials = result.data

        // remove duplicate
        let cleanMaterials = []
        if (rawMaterials.length > 0) {
          let seenIds = []

          for (let index = 0; index < rawMaterials.length; index++) {
            const sponsorMaterial = rawMaterials[index]
            let link = sponsorMaterial[1]
            let id = sponsorMaterial[2].id

            if (link !== null) {
              if (!seenIds.includes(id)) {
                seenIds.push(id)
                cleanMaterials.push(sponsorMaterial)
              }
            }
          }
        }

        // remove empty materials
        let filteredMaterials = []
        if (cleanMaterials.length > 0) {
          filteredMaterials = cleanMaterials.filter((item) => {
            return item[1] !== null
          })
        }

        if (filteredMaterials.length > 0) {
          for (let index = 0; index < filteredMaterials.length; index++) {
            const item = filteredMaterials[index]
            const productId = item[2].id

            await faunaClient
              .query(q.Get(q.Ref(q.Collection('products'), productId)))
              .then((ret) => {
                const data = ret.data

                resultData.push({
                  id: productId,
                  program: data.name,
                  date: moment(data.startDt).format('YYYY-MM-DD | hh:mm A'),
                  link: `${process.env.NEXT_PUBLIC_FRONTEND_API_URL}/events-classes/program/${data.slug}`,
                  materials: data.sponsorMaterialMeta,
                })
              })
              .catch((err) => {
                // @TODO: log error
              })
          }
        }
      })
  } catch (error) {
    return {
      status: false,
      data: [{ key: 'general', values: error.description }],
    }
  }

  return { status: true, data: resultData }
}

const processMaterialDefault = async (userOrgProfile) => {
  let resultData = []
  try {
    await faunaClient
      .query(
        q.Paginate(q.Match(q.Index('sponsorMaterialMeta')), { size: 100000 })
      )
      .then(async (result) => {
        let rawMaterials = result.data

        // remove duplicate
        let cleanMaterials = []
        if (rawMaterials.length > 0) {
          let seenIds = []

          for (let index = 0; index < rawMaterials.length; index++) {
            const sponsorMaterial = rawMaterials[index]
            let link = sponsorMaterial[0]
            let id = sponsorMaterial[1].id

            if (link !== null) {
              if (!seenIds.includes(id)) {
                seenIds.push(id)
                cleanMaterials.push(sponsorMaterial)
              }
            }
          }
        }

        // remove empty materials
        let filteredMaterials = []
        if (cleanMaterials.length > 0) {
          filteredMaterials = cleanMaterials.filter((item) => {
            return item[0] !== null
          })
        }

        if (filteredMaterials.length > 0) {
          for (let index = 0; index < filteredMaterials.length; index++) {
            const item = filteredMaterials[index]
            const productId = item[1].id

            await faunaClient
              .query(q.Get(q.Ref(q.Collection('products'), productId)))
              .then((ret) => {
                const data = ret.data

                if (data.status == 'published') {
                  resultData.push({
                    id: productId,
                    program: data.name,
                    date: moment(data.startDt).format('YYYY-MM-DD | hh:mm A'),
                    link: `${process.env.NEXT_PUBLIC_FRONTEND_API_URL}/events-classes/program/${data.slug}`,
                    materials: data.sponsorMaterialMeta,
                  })
                }
              })
              .catch((err) => {
                // @TODO: log error
              })
          }
        }
      })
  } catch (error) {
    return {
      status: false,
      data: [{ key: 'general', values: error.description }],
    }
  }

  return { status: true, data: resultData }
}

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

    const { search, sort_date, sort_topic } = req.body

    let resultData = []

    const isSearchOnly =
      search.length > 0 && sort_date.length <= 0 && sort_topic.length <= 0
    const isSearchAndDateOnly =
      search.length > 0 && sort_date.length > 0 && sort_topic.length <= 0
    const isSearchAndTopicOnly =
      search.length > 0 && sort_date.length <= 0 && sort_topic.length > 0
    const isDateOnly =
      search.length <= 0 && sort_date.length > 0 && sort_topic.length <= 0
    const isTopicOnly =
      search.length <= 0 && sort_date.length <= 0 && sort_topic.length > 0

    try {
      if (isSearchOnly) {
        await processSearchOnly(userOrgProfile, search).then((result) => {
          let { status, data } = result

          if (status) {
            resultData = data
          } else {
            res.status(422).json(data)
            return
          }
        })
      } else if (isSearchAndDateOnly) {
        let faunaIndex =
          sort_date == 'date_asc'
            ? 'sponsorMaterialMeta_search_sort_date_asc'
            : 'sponsorMaterialMeta_search_sort_date_desc'

        await processDateWithSearch(userOrgProfile, faunaIndex, search).then(
          (result) => {
            let { status, data } = result

            if (status) {
              resultData = data
            } else {
              throw data
            }
          }
        )
      } else if (isSearchAndTopicOnly) {
        let faunaIndex =
          sort_topic == 'topic_asc'
            ? 'sponsorMaterialMeta_sort_topic_asc'
            : 'sponsorMaterialMeta_sort_topic_desc'

        await processTopicWithSearch(userOrgProfile, faunaIndex, search).then(
          (result) => {
            let { status, data } = result

            if (status) {
              resultData = data
            } else {
              throw data
            }
          }
        )
      } else if (isDateOnly) {
        let faunaIndex =
          sort_date == 'date_asc'
            ? 'sponsorMaterialMeta_sort_date_asc'
            : 'sponsorMaterialMeta_sort_date_desc'

        await processDateOrTopicOnly(userOrgProfile, faunaIndex).then(
          (result) => {
            let { status, data } = result

            if (status) {
              resultData = data
            } else {
              throw data
            }
          }
        )
      } else if (isTopicOnly) {
        let faunaIndex =
          sort_topic == 'topic_asc'
            ? 'sponsorMaterialMeta_sort_topic_asc'
            : 'sponsorMaterialMeta_sort_topic_desc'

        await processDateOrTopicOnly(userOrgProfile, faunaIndex).then(
          (result) => {
            let { status, data } = result

            if (status) {
              resultData = data
            } else {
              throw data
            }
          }
        )
      } else {
        await processMaterialDefault(userOrgProfile).then((result) => {
          let { status, data } = result

          if (status) {
            resultData = data
          } else {
            res.status(422).json(data)
            return
          }
        })
      }

      res.status(200).json(resultData)
      return
    } catch (error) {
      res.status(422).json([{ key: 'general', values: error.description }])
      return
    }
  }
}

export default handler
