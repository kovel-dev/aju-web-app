import Cors from 'cors'
import corsMiddleware from '../../../../../lib/middleware/cors'
import jwt from 'next-auth/jwt'
import User from '../../../../../lib/models/user'
import moment from 'moment'
import { query as q } from 'faunadb'
import { faunaClient } from '../../../../../lib/config/fauna'
import {
  hashPassword,
  verifyPassword,
} from '../../../../../lib/middleware/auth'

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
    // check if request payload is the same as the id being updated then proceed
    // else forbidden
    if (payload.userRefID !== req.query.id) {
      res.status(401).json([{ key: 'general', values: 'Forbidden' }])
    }

    // check email is valid then proceed
    // else error message
    let user = new User({})
    let currentUserRefNumber = null
    let userResult = null
    try {
      await User.getUserByEmail(payload.email).then((result) => {
        currentUserRefNumber = result['ref'].id
        userResult = result.data
        user = new User(result.data)
      })
    } catch (error) {
      res.status(422).json([{ key: 'general', values: error.description }])
      return
    }

    // update user profile process
    const data = req.body

    // update user with request data
    for (const key in data) {
      user[key] = data[key]
    }

    // get password credentials
    const { password, confirm_password, old_password } = data

    // verify password credential if fields are not empty
    if (
      password.length > 0 ||
      confirm_password.length > 0 ||
      old_password.length > 0
    ) {
      const isValid = await verifyPassword(old_password, userResult.password)

      if (!isValid) {
        res.status(422).json([
          {
            key: 'old_password',
            values: "Old Password doesn't much the current password",
          },
        ])
        return
      }

      if (old_password == password) {
        res.status(422).json([
          {
            key: 'old_password',
            values: 'Old Password should not much the new password',
          },
        ])
        return
      }
    }

    // validate user input
    try {
      await user.validateIndividualForm(password, confirm_password)
    } catch (error) {
      res.status(422).json(error)
      return
    }

    let newUserObj = user.getValues()

    // set update info
    newUserObj.updated_at = moment().format('YYYY-MM-DD HH:mm:ss')
    newUserObj.updated_by = currentUserRefNumber

    // build user info to update
    if (
      password.length > 0 ||
      confirm_password.length > 0 ||
      old_password.length > 0
    ) {
      newUserObj['password'] = await hashPassword(password)
    }

    // save/update user
    try {
      return await faunaClient
        .query(
          q.Update(q.Ref(q.Collection('users'), currentUserRefNumber), {
            data: newUserObj,
          })
        )
        .then((result) => {
          res.status(200).json({ message: 'User updated!' })
          return
        })
    } catch (error) {
      res.status(422).json([{ key: 'general', values: error.description }])
      return
    }
  }
}

export default handler
