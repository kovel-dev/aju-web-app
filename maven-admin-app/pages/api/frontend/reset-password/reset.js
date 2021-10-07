import Cors from 'cors'
import corsMiddleware from '../../../../lib/middleware/cors'
import moment from 'moment'
import { query as q } from 'faunadb'
import { faunaClient } from '../../../../lib/config/fauna'
import { hashPassword } from '../../../../lib/middleware/auth'
import * as Yup from 'yup'

// Initializing the cors middleware
const cors = corsMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    origin: [process.env.NEXT_PUBLIC_FRONTEND_API_URL],
    methods: ['GET'],
  })
)

const LoginValidation = () => {
  let yupObj = {
    password: Yup.string()
      .required({
        key: 'password',
        values: 'Password is required',
      })
      .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
        message: {
          key: 'password',
          values: 'Must Contain 8 Characters and at least One Number',
        },
      }),
    confirm_password: Yup.string()
      .required({
        key: 'confirm_password',
        values: 'Confirm Password is required',
      })
      .oneOf([Yup.ref('password'), null], {
        key: 'password',
        values: 'Password must match',
      }),
  }

  return Yup.object().shape(yupObj)
}

async function handler(req, res) {
  // Run the middleware
  await cors(req, res)

  const data = req.body

  const { token, password, confirm_password } = data
  let currentUserRefNumber = null

  // get user model by token
  try {
    await faunaClient
      .query(q.Get(q.Match(q.Index('users_by_reset_password_token'), token)))
      .then(async (result) => {
        try {
          await LoginValidation().validate(data, { abortEarly: false })
        } catch (error) {
          res.status(422).json(error.errors)
          return
        }

        currentUserRefNumber = result['ref'].id
        let userRes = result.data

        if (userRes.status !== 'active') {
          res.status(401).json([{ key: 'general', values: 'Forbidden' }])
          return
        }

        userRes.reset_password_token = ''
        userRes.password = await hashPassword(password)
        userRes.updated_by = currentUserRefNumber
        userRes.updated_at = moment().format('YYYY-MM-DD HH:mm:ss')

        // update user
        try {
          await faunaClient
            .query(
              q.Update(q.Ref(q.Collection('users'), currentUserRefNumber), {
                data: userRes,
              })
            )
            .then(async (result) => {
              res.status(200).json('Password Reset!')
              return
            })
        } catch (error) {
          res.status(422).json([{ key: 'general', values: error.description }])
          return
        }
      })
  } catch (error) {
    res.status(422).json([
      {
        key: 'general',
        values: 'The reset password link has already been used or invalid.',
      },
    ])
    return
  }
}

export default handler
