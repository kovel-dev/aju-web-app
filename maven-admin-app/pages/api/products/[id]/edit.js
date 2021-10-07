import moment from 'moment'
import Product from '../../../../lib/models/product'
import User from '../../../../lib/models/user'
import { getSession } from 'next-auth/client'
import { query as q } from 'faunadb'
import { faunaClient } from '../../../../lib/config/fauna'
var momentTz = require('moment-timezone')

async function handler(req, res) {
  if (req.method == 'POST') {
    const session = await getSession({ req: req })

    if (!session) {
      res.status(401).json([{ key: 'general', values: 'Not Authenticated' }])
      return
    }

    const data = req.body
    let product = new Product(data)
    let dateFormat = 'yyyy-MM-DD HH:mm:ss'
    let dateDefaultTimezone = 'America/Los_Angeles'

    // Validate product input
    try {
      await product.validate('update', req.query.id)
    } catch (error) {
      res.status(422).json(error)
      return
    }

    let user = new User({})
    const currentUserRefNumber = session.user.id

    // update create and update details

    product.startDt = moment(
      moment.tz(product.startDt, dateDefaultTimezone)
    ).format(dateFormat)

    product.endDt = moment(
      moment.tz(product.endDt, dateDefaultTimezone)
    ).format(dateFormat)

    product.registrationStartDt = moment(
      moment.tz(product.registrationStartDt, dateDefaultTimezone)
    ).format(dateFormat)

    product.registrationEndDt = moment(
      moment.tz(product.registrationEndDt, dateDefaultTimezone)
    ).format(dateFormat)

    product.millisecondStartDt = moment
      .utc(moment.tz(product.startDt, dateDefaultTimezone))
      .valueOf()

    product.millisecondEndDt = moment
      .utc(moment.tz(product.endDt, dateDefaultTimezone))
      .valueOf()

    product.millisecondRegistrationStartDt = moment
      .utc(moment.tz(product.registrationStartDt, dateDefaultTimezone))
      .valueOf()

    product.millisecondRegistrationEndDt = moment
      .utc(moment.tz(product.registrationEndDt, dateDefaultTimezone))
      .valueOf()

    product.updatedAt = moment(
      moment.tz(new Date(), dateDefaultTimezone)
    ).format(dateFormat)
    product.updatedBy = currentUserRefNumber

    if (product.isReserved == 'yes') {
      product.reservedAt = moment().format(dateFormat)
    }

    // save/update product
    try {
      return await faunaClient
        .query(
          q.Update(q.Ref(q.Collection('products'), req.query.id), {
            data: product.getValues(),
          })
        )
        .then((result) => {
          res.status(200).json({ message: 'Updated product!' })
          return
        })
    } catch (error) {
      res.status(422).json([{ key: 'general', values: error.description }])
      return
    }
  }
}

export default handler
