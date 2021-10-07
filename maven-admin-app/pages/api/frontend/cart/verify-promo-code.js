import Cors from 'cors'
import corsMiddleware from '../../../../lib/middleware/cors'
import jwt from 'next-auth/jwt'
import { query as q } from 'faunadb'
import { faunaClient } from '../../../../lib/config/fauna'

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
  // let CORS check if the request is allowed
  await cors(req, res)
  let payload = null
  // check if you can verify the api token then do your process
  // else it's an invalid api token
  try {
    // Guide: https://nate-d-gage.medium.com/authentication-with-next-js-and-json-web-token-baf93ce7a63
    const apiToken = req.headers.authorization.replace('Bearer ', '')
    payload = await jwt.decode({ token: apiToken, secret: secret })

    // payload example
    // {
    //   name: 'Carly',
    //   email: 'rabytakaza@mailinator.net',
    //   userRefID: '306206295279534660',
    //   userRole: 'student',
    //   userStatus: 'active',
    //   iat: 1629236612,
    //   exp: 1631828612
    // }
  } catch (error) {
    res.status(401).json([{ key: 'general', values: 'Not Authenticated' }])
    return
  }

  if (req.method == 'POST') {
    const data = req.body

    // get parameters from the request body
    // {promoCode}
    let { promoCode } = data

    // VALIDATE THE PROMOCODE
    // get users cart meta (items)
    // get userProfile based on userRefId
    const userId = payload.userRefID

    let userProfile = null
    try {
      await faunaClient
        .query(q.Get(q.Ref(q.Collection('users'), userId)))
        .then((ret) => {
          userProfile = ret
        })
    } catch (error) {
      res.status(422).json([{ key: 'general', values: error.description }])
      return
    }

    let cartMeta = userProfile.data.cart_meta

    // get users affiliation
    let affiliation = null
    // student
    if (payload.userRole == 'student') {
      affiliation = userProfile.data.affiliation_id
    } else if (payload.userRole == 'partner') {
      // partner
      try {
        await faunaClient
          .query(
            q.Paginate(q.Match(q.Index('organizations_by_owner_id'), userId))
          )
          .then((ret) => {
            affiliation = ret.ref.id
          })
      } catch (error) {
        res.status(422).json([{ key: 'general', values: error.description }])
        return
      }
    }

    // validate the promocode by checking the following:
    // else respond with error message(promoCode): based on the error condition
    let promoCodeObj = null
    try {
      await faunaClient
        .query(q.Get(q.Match(q.Index('promo_codes_by_code'), promoCode)))
        .then((ret) => {
          promoCodeObj = ret
        })
    } catch (error) {
      res.status(422).json([{ key: 'general', values: error.description }])
      return
    }

    //    if promocode is active
    if (promoCodeObj.data.status !== 'active') {
      res
        .status(422)
        .json([
          { key: 'promoCode', values: 'Sorry! Promo code is not available' },
        ])
      return
    }

    //    if promocode is within the used limit
    if (promoCodeObj.data.use_counter >= promoCodeObj.data.use_limit) {
      res.status(422).json([
        {
          key: 'promoCode',
          values: 'Sorry! Promo code has already reached its used limit',
        },
      ])
      return
    }

    // example promoCodeObj.data.products_meta
    // [
    //   {
    //     "label": "Product3",
    //     "value": "307026543906914885"
    //   }
    // ]

    //    if promocode is linked to a product
    //      check if cart item has the same product
    let productIds = []
    if (promoCodeObj.data.products_meta.length > 0) {
      let hasProduct = false
      promoCodeObj.data.products_meta.map((item, index) => {
        let productId = item.value

        cartMeta.map((cartItem, cartIndex) => {
          if (cartItem.productId == productId) {
            hasProduct = true
            productIds.push(productId)
          }
        })
      })

      if (!hasProduct) {
        res.status(422).json([
          {
            key: 'promoCode',
            values: "Sorry! You don't have an item to use this promo code",
          },
        ])
        return
      }
    }

    //    if promocode has affiliation,
    //       check if user affliation is equals to the promocode affiliation
    if (promoCodeObj.data.organization_meta.length > 0) {
      if (promoCodeObj.data.organization_meta !== affiliation) {
        res.status(422).json([
          {
            key: 'promoCode',
            values:
              "Sorry! You're not affiliated with the organization to use this promo code",
          },
        ])
        return
      }
    }

    res.status(200).json({
      code: promoCodeObj.data.code,
      percentage: promoCodeObj.data.percentage,
      productIds: productIds,
    })
    return
  }
}

export default handler
