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

    let user = new User({})
    const currentUserRefNumber = session.user.id

    const promoCodeRefNumber = req.query.id
    let promoCode = new PromoCode({})

    try {
      await faunaClient
        .query(q.Get(q.Ref(q.Collection('promo_codes'), promoCodeRefNumber)))
        .then((ret) => {
          promoCode = new PromoCode(ret.data)
        })
    } catch (error) {
      res.status(422).json([{ key: 'general', values: error.description }])
      return
    }

    promoCode.status = 'inactive'
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
          res.status(200).json({ message: 'Promo code deactivated!' })
          return
        })
    } catch (error) {
      res.status(422).json([{ key: 'general', values: error.description }])
      return
    }
  }
}

export default handler
