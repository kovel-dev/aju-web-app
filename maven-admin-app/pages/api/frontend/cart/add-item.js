import Cors from 'cors'
import moment from 'moment'
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
  } catch (error) {
    res.status(401).json([{ key: 'general', values: 'Not Authenticated' }])
    return
  }

  if (req.method == 'POST') {
    const data = req.body

    const userId = payload.userRefID

    // get productRefId, userRefId from request body
    let { slug } = data

    // get userProfile based on userRefId
    let userProfile = null
    await faunaClient
      .query(q.Get(q.Ref(q.Collection('users'), userId)))
      .then((ret) => {
        userProfile = ret
      })
      .catch((err) => {
        res.status(422).json([{ key: 'general', values: err.description }])
        return
      })

    // get productProfiel based on productRefId
    let productProfile = null
    let productId = null
    await faunaClient
      .query(q.Get(q.Match(q.Index('products_by_slug'), slug)))
      .then((ret) => {
        productId = ret.ref.id
        productProfile = ret
      })
      .catch((err) => {
        res.status(422).json([{ key: 'general', values: err.description }])
        return
      })

    // get each cart item and add quantity to the item based on productRefId
    let userData = userProfile.data
    let cartItemQuantity = 1

    if (userData.cart_meta && userData.cart_meta.length > 0) {
      let cartMeta = userData.cart_meta
      let hasItem = false

      // increment quantity of the value if user added again the same product
      let newCartMeta = cartMeta.map((item, index) => {
        if (item.productId == productId) {
          item.quantity += 1
          item.price = Number(productProfile.data.price)
          item.total = Number(productProfile.data.price) * item.quantity
          item.updatedAt = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
          item.updatedBy = userProfile.ref.id

          cartItemQuantity = item.quantity
          hasItem = true
        }
        return item
      })

      // add new item in the list
      if (!hasItem) {
        newCartMeta.push({
          productId: productProfile.ref.id,
          title: productProfile.data.name,
          imageUrl:
            productProfile.data.imageUrl ||
            `${process.env.NEXT_PUBLIC_FRONTEND_API_URL}/images/class-default.jpg`,
          startDt: productProfile.data.startDt,
          millisecondStartDt: productProfile.data.millisecondStartDt,
          type: productProfile.data.type,
          link: productProfile.data.link,
          slug: productProfile.data.slug,
          address: productProfile.data.address,
          sponsorBy: productProfile.data.sponsorMeta || '',
          price: Number(productProfile.data.price),
          quantity: cartItemQuantity,
          total: Number(productProfile.data.price),
          createdAt: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
          createdBy: userProfile.ref.id,
          updatedAt: '',
          updatedBy: '',
        })
      }

      userData.cart_meta = newCartMeta
    } else {
      // add new item in the cart meta
      userData.cart_meta = [
        {
          productId: productProfile.ref.id,
          title: productProfile.data.name,
          imageUrl:
            productProfile.data.imageUrl ||
            `${process.env.NEXT_PUBLIC_FRONTEND_API_URL}/images/class-default.jpg`,
          startDt: productProfile.data.startDt,
          millisecondStartDt: productProfile.data.millisecondStartDt,
          type: productProfile.data.type,
          link: productProfile.data.link,
          slug: productProfile.data.slug,
          address: productProfile.data.address,
          sponsorBy: productProfile.data.sponsorMeta || '',
          price: Number(productProfile.data.price),
          quantity: cartItemQuantity,
          total: Number(productProfile.data.price),
          createdAt: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
          createdBy: userProfile.ref.id,
          updatedAt: '',
          updatedBy: '',
        },
      ]
    }

    // check if the product added/updated still within the product capacity then proceed
    let newProductProfile = null
    await faunaClient
      .query(q.Get(q.Ref(q.Collection('products'), productId)))
      .then((ret) => {
        newProductProfile = ret
      })
      .catch((err) => {
        res.status(422).json([{ key: 'general', values: err.description }])
        return
      })

    let newProductProfileData = newProductProfile.data

    // else return error message: Sorry! The product has already reached it's maximum capacity.
    if (parseInt(newProductProfileData.capacity) < cartItemQuantity) {
      res.status(422).json([
        {
          key: 'general',
          values: `${productProfile.data.name} has already reached it's maximum capacity`,
        },
      ])
      return
    }

    // update the userProfile with added/updated cart item
    try {
      await faunaClient
        .query(
          q.Update(q.Ref(q.Collection('users'), userId), { data: userData })
        )
        .then(async (result) => {
          res.status(200).json('Item added to cart!')
          return
        })
    } catch (error) {
      res.status(422).json([{ key: 'general', values: error.description }])
      return
    }
  }
}

export default handler
