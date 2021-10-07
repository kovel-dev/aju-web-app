import Cors from 'cors'
import moment from 'moment'
import corsMiddleware from '../../../../lib/middleware/cors'
import jwt from 'next-auth/jwt'
import Order from '../../../../lib/models/order'
import Attendee from '../../../../lib/models/attendee'
import PromoCode from '../../../../lib/models/promo-code'
import { query as q } from 'faunadb'
import { faunaClient } from '../../../../lib/config/fauna'
import { getToken } from '../../../../lib/handlers/helper-handlers'
import { sendEmail } from '../../../../lib/mail/mail'

// Initializing the cors middleware
const cors = corsMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    origin: [process.env.NEXT_PUBLIC_FRONTEND_API_URL],
    methods: ['POST'],
  })
)

const secret = process.env.JWT_SECRET

const generatePromocodeForCheckout = async (
  count,
  orderId,
  productId,
  productTitle,
  userId
) => {
  let promoCodes = []
  for (let index = 0; index < count; index++) {
    let newDate = moment(new Date())
    let code = getToken(4, false)

    let promoCode = new PromoCode({
      name: 'Generated Promo Code for Order: ' + orderId,
      description: 'auto-generated',
      code: code,
      status: 'active',
      percentage: 100,
      use_limit: 1,
      is_from_checkout: true,
      products_meta: [
        {
          label: productTitle,
          value: productId,
        },
      ],
      created_at: moment.utc(newDate).valueOf(),
      created_by: userId,
    })

    try {
      await faunaClient
        .query(
          q.Create(q.Collection('promo_codes'), { data: promoCode.getValues() })
        )
        .then((result) => {
          promoCodes.push(code)
        })
    } catch (error) {
      // @TODO: record error saving the promocode
    }
  }

  return promoCodes
}

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
    const userId = payload.userRefID
    const data = req.body
    // get parameters from the request body
    let {
      isSubscribe,
      promoCodes,
      payAmount,
      cardHolderName,
      transactionId,
      answers,
    } = data

    // get users cart meta (items)
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

    if (cartMeta.length <= 0) {
      res.status(404).json([{ key: 'general', values: 'No Cart Item Found.' }])
      return
    }

    // get the total of items
    let cartTotal = 0
    cartMeta.map((item, index) => {
      cartTotal = Number(cartTotal) + Number(item.total)
    })

    // get the total discount
    let totalDiscount = 0

    // get the total after tax and discount
    let newPayAmount = 0

    if (promoCodes.length > 0) {
      // loop promo code with product linked and deduct
      let discount = 0
      cartMeta.map((cartItem, cartIndex) => {
        promoCodes.map((item, index) => {
          if (item.productIds.length > 0) {
            item.productIds.map((id, index) => {
              if (cartItem.productId == id) {
                discount =
                  Number(item.percentage / 100) * Number(cartItem.total)
              }
            })
          }
        })
      })

      newPayAmount = cartTotal - discount

      // loop promo code without product linked and deduct
      let arrOfPercentageWithoutProdLinked = []
      promoCodes.map((item, index) => {
        if (item.productIds.length <= 0) {
          arrOfPercentageWithoutProdLinked.push(item.percentage)
        }
      })

      let discount2 = 0
      if (arrOfPercentageWithoutProdLinked.length > 0) {
        arrOfPercentageWithoutProdLinked.map((percentage, percentageIndex) => {
          discount2 = (percentage / 100) * newPayAmount
        })
      }

      totalDiscount = discount + discount2
      newPayAmount = newPayAmount - discount2
    } else {
      newPayAmount = payAmount
    }

    // check if promocode has reserve seat attributes:
    //  contained in products_meta
    //  organization_meta not empty which means it belongs to organization
    let forReservedSeatPromoCodesIds = []
    if (promoCodes.length > 0) {
      for (let index = 0; index < promoCodes.length; index++) {
        const promoCode = promoCodes[index]
        try {
          await faunaClient
            .query(
              q.Get(q.Match(q.Index('promo_codes_by_code'), promoCode.code))
            )
            .then((ret) => {
              let promoCodeProfile = ret.data

              // organization_meta: "",
              if (
                promoCodeProfile.organization_meta.length > 0 &&
                promoCodeProfile.products_meta.length > 0
              ) {
                promoCodeProfile.products_meta.map((item, index) => {
                  // products_meta: [
                  //   {
                  //     label: "Product1",
                  //     value: "306755099609268805",
                  //   },
                  //   {
                  //     label: "Product2",
                  //     value: "307026523842413124",
                  //   },
                  //   {
                  //     label: "Product3",
                  //     value: "307026543906914885",
                  //   },
                  // ],
                  forReservedSeatPromoCodesIds.push(item.value)
                })
              }
            })
        } catch (error) {
          // @TODO Log error
        }
      }
    }

    // get complete program profile on each item
    let programsData = []

    // process product capacity deduction
    cartMeta.map(async (item, index) => {
      if (!forReservedSeatPromoCodesIds.includes(item.productId)) {
        let newProductProfile = null
        await faunaClient
          .query(q.Get(q.Ref(q.Collection('products'), item.productId)))
          .then((ret) => {
            newProductProfile = ret
            programsData.push(ret.data)
          })
          .catch((err) => {
            // @TODO: record error getting product profile
          })

        // deduct capacity
        let newProductProfileData = newProductProfile.data
        newProductProfileData.capacity =
          Number(newProductProfileData.capacity) - Number(item.quantity)
        newProductProfileData.updatedBy = userId
        newProductProfileData.updatedAt = moment(new Date()).format(
          'YYYY-MM-DD HH:mm:ss'
        )

        try {
          await faunaClient.query(
            q.Update(q.Ref(q.Collection('products'), item.productId), {
              data: newProductProfileData,
            })
          )
        } catch (error) {
          // @TODO: record error updating product capacity
        }
      }
    })

    // process promocode used counter
    let promoCodesUsed = []
    promoCodes.map(async (item, index) => {
      let promoCodeObj = null
      try {
        await faunaClient
          .query(q.Get(q.Match(q.Index('promo_codes_by_code'), item.code)))
          .then((ret) => {
            promoCodeObj = ret
            promoCodesUsed.push(item.code)
          })
      } catch (error) {
        // @TODO: record error getting promo code profile
      }

      let newPromoCodeObj = promoCodeObj.data
      newPromoCodeObj.use_counter = Number(promoCodeObj.data.use_counter) + 1
      newPromoCodeObj.updated_at = moment(new Date()).format(
        'YYYY-MM-DD HH:mm:ss'
      )
      newPromoCodeObj.updated_by = userId

      try {
        await faunaClient.query(
          q.Update(q.Ref(q.Collection('promo_codes'), promoCodeObj.ref.id), {
            data: newPromoCodeObj,
          })
        )
      } catch (error) {
        // @TODO: record error updating promocode use counter
      }
    })

    // process order
    let newDate = moment(new Date())
    let order = new Order({
      items: cartMeta,
      promoUsedMeta: promoCodes,
      price: cartTotal,
      discount: totalDiscount,
      subtotal: newPayAmount,
      tax: 0,
      total: newPayAmount,
      slug: getToken(8),
      status: 'paid',
      transactionId: transactionId,
      isSubscribe: isSubscribe,
      cardHolderName: cardHolderName,
      created_at: moment.utc(newDate).valueOf(),
      created_by: userId,
    })

    let orderObj = null
    try {
      await faunaClient
        .query(q.Create(q.Collection('orders'), { data: order.getValues() }))
        .then((ret) => {
          orderObj = ret
        })
    } catch (error) {
      // @TODO: record error creating order record
      res.status(422).json([
        {
          key: 'general',
          values: 'Sorry! There has been an error creating your order',
        },
      ])
      return
    }

    // process attendees
    cartMeta.map(async (item, index) => {
      let newDate = moment(new Date())

      let attendee = new Attendee({
        orderId: orderObj.ref.id,
        productId: item.productId,
        userId: userId,
        created_at: moment.utc(newDate).valueOf(),
        created_by: userId,
        answerMeta: answers[item.productId] || '',
      })

      try {
        await faunaClient.query(
          q.Create(q.Collection('attendees'), { data: attendee.getValues() })
        )
      } catch (error) {
        // @TODO: record error creating attendee record
      }
    })

    // process user cart_meta reset
    let newUserObj = userProfile.data
    newUserObj.cart_meta = []

    // process waitlist removal
    if (!newUserObj.waitlist_meta) {
      newUserObj['waitlist_meta'] = []
    }

    if (newUserObj.waitlist_meta.length > 0) {
      let newWishList = newUserObj.waitlist_meta
      cartMeta.map((item, index) => {
        const itemIndex = newWishList.indexOf(item.productId)
        if (itemIndex > -1) {
          newWishList.splice(itemIndex, 1)
        }
      })

      newUserObj.waitlist_meta = newWishList
    }

    newUserObj.updated_by = userId
    newUserObj.updated_at = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')

    try {
      await faunaClient.query(
        q.Update(q.Ref(q.Collection('users'), userProfile.ref.id), {
          data: newUserObj,
        })
      )
    } catch (error) {
      console.log('removing cart meta failed.')
    }

    // process promo code generation
    let genPromoCodes = []
    for (let index = 0; index < cartMeta.length; index++) {
      const item = cartMeta[index]

      let neededPromoCodeCount = Number(item.quantity) - 1
      if (neededPromoCodeCount > 0) {
        try {
          await generatePromocodeForCheckout(
            neededPromoCodeCount,
            orderObj.ref.id,
            item.productId,
            item.title,
            userId
          ).then((result) => {
            genPromoCodes = genPromoCodes.concat(result)
          })
        } catch (error) {
          // @TODO: record error on generating promoCode
        }
      }
    }

    // process order email confirmation
    let hasSend = true
    try {
      hasSend = await sendEmail('fe-order-confirmation', {
        email: userProfile.data.email,
        name: userProfile.data.first_name + ' ' + userProfile.data.last_name,
        order: orderObj.data,
        cart: programsData,
        promoCodesUsed: promoCodesUsed,
        genPromoCodes: genPromoCodes,
      })
    } catch (error) {
      hasSend = false
    }

    // update order with email status
    let newOrderObj = orderObj.data
    newDate = moment(new Date())
    newOrderObj.promoGeneratedMeta = genPromoCodes
    newOrderObj.isEmailSent = hasSend
    newOrderObj.updated_at = moment.utc(newDate).valueOf()
    newOrderObj.updated_by = userId

    try {
      await faunaClient.query(
        q.Update(q.Ref(q.Collection('orders'), orderObj.ref.id), {
          data: newOrderObj,
        })
      )
    } catch (error) {
      // @TODO: record error updating promocode use counter
    }

    // process response with order confirmation status
    res.status(200).json({
      redirectLink: orderObj.ref.id + '/' + orderObj.data.slug,
      emailSend: hasSend,
    })
  }
}

export default handler
