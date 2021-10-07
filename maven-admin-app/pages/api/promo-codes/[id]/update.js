import moment from 'moment'
import User from '../../../../lib/models/user'
import PromoCode from '../../../../lib/models/promo-code'
import { getSession } from 'next-auth/client'
import { query as q } from 'faunadb'
import { faunaClient } from '../../../../lib/config/fauna'

async function handler(req, res) {
  if (req.method == 'POST') {
    const session = await getSession({ req: req })

    if (!session) {
      res.status(401).json([{ key: 'general', values: 'Not Authenticated' }])
      return
    }

    const data = req.body
    let promoCode = new PromoCode(data)

    // Validate promoCode input
    try {
      await promoCode.validate()
    } catch (error) {
      res.status(422).json(error)
      return
    }

    let user = new User({})
    let currentUserRefNumber = null
    try {
      await user.getUserByEmail(session.user.email).then((result) => {
        currentUserRefNumber = result['ref'].id
      })
    } catch (error) {
      res.status(422).json([{ key: 'general', values: error.description }])
      return
    }

    // update create and update details
    promoCode.code = promoCode.code.replace(/\s/g, '')
    promoCode.updated_at = moment().format('YYYY-MM-DD HH:mm:ss')
    promoCode.updated_by = currentUserRefNumber

    // save/update promoCode
    try {
      return await faunaClient
        .query(
          q.Update(q.Ref(q.Collection('promo_codes'), req.query.id), {
            data: promoCode.getValues(),
          })
        )
        .then((result) => {
          res.status(200).json({ message: 'Updated promo code!' })
          return
        })
    } catch (error) {
      res.status(422).json([{ key: 'general', values: error.description }])
      return
    }
  }
}

export default handler
