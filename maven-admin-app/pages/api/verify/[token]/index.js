import moment from 'moment'
import User from '../../../../lib/models/user'
import { query as q } from 'faunadb'
import { getSession } from 'next-auth/client'
import { faunaClient } from '../../../../lib/config/fauna'
import { validatePassword } from '../../../../lib/validations/validations'
import { hashPassword } from '../../../../lib/middleware/auth'

async function handler(req, res) {
  const session = await getSession({ req: req })

  if (session) {
    res.status(403).json([{ key: 'general', values: 'Forbidden' }])
    return
  }

  let user = new User({})

  // get user model by token
  const token = req.query.token
  try {
    await faunaClient
      .query(q.Get(q.Match(q.Index('users_by_verification_token'), token)))
      .then(async (result) => {
        user = new User(result.data)
      })
  } catch (error) {
    res
      .status(422)
      .json([{ key: 'general', values: 'Invalid verification link.' }])
    return
  }

  if (req.method == 'GET') {
    let userDetails = user.getValues()
    if (userDetails.email.length > 0) {
      // check if user model has already been verified then send error message
      if (userDetails.is_verified) {
        res.status(422).json([
          {
            key: 'general',
            values: 'The verification link has already been used.',
          },
        ])
      } else {
        // else continue with email verification
        res.status(200).json([{ message: 'Continue with email verification.' }])
      }
    }
  } else if (req.method == 'POST') {
    let userDetails = user.getValues()
    if (userDetails.email.length > 0) {
      const data = req.body
      const { password } = data

      // validate password
      try {
        await validatePassword(data)
      } catch (error) {
        res.status(422).json(error)
        return
      }

      let currentUserRefNumber = null
      try {
        await User.getUserByEmail(userDetails.email).then((result) => {
          currentUserRefNumber = result['ref'].id
        })
      } catch (error) {
        res.status(422).json([{ key: 'general', values: error.description }])
        return
      }

      // add updated data
      userDetails.status = 'active'
      userDetails.is_verified = true
      userDetails.verification_date = moment().format('YYYY-MM-DD HH:mm:ss')
      userDetails['password'] = await hashPassword(password)
      userDetails.updated_by = currentUserRefNumber
      userDetails.updated_at = moment().format('YYYY-MM-DD HH:mm:ss')
      // delete userDetails.confirm_password;

      // update user
      try {
        await faunaClient
          .query(
            q.Update(q.Ref(q.Collection('users'), currentUserRefNumber), {
              data: userDetails,
            })
          )
          .then(async (result) => {
            res.status(200).json([{ message: 'User updated!' }])
            return
          })
      } catch (error) {
        res.status(422).json([{ key: 'general', values: error.description }])
        return
      }
    }
  }
}

export default handler
