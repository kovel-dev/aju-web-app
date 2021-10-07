import Cors from 'cors'
import corsMiddleware from '../../../../lib/middleware/cors'
import jwt from 'next-auth/jwt'
import OrganizationForm from '../../../../lib/models/frontend/organization-form'
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

  // check if you can verify the api token then do your process
  // else it's an invalid api token
  try {
    // Guide: https://nate-d-gage.medium.com/authentication-with-next-js-and-json-web-token-baf93ce7a63
    const apiToken = req.headers.authorization.replace('Bearer ', '')
    const payload = await jwt.decode({ token: apiToken, secret: secret })
  } catch (error) {
    res.status(401).json([{ key: 'general', values: 'Not Authenticated' }])
    return
  }

  if (req.method == 'POST') {
    const data = req.body
    const { ref } = data

    // get user record
    let userRefId = null
    let user = null
    await faunaClient
      .query(q.Get(q.Ref(q.Collection('users'), ref)))
      .then((ret) => {
        userRefId = ret['ref'].id
        user = ret.data
      })
      .catch((err) => {
        res.status(422).json([{ key: 'general', values: err.description }])
        return
      })

    if (user == null) {
      res.status(422).json([
        {
          key: 'general',
          values: 'There has been an error getting your profile',
        },
      ])
      return
    }

    // get the organization ref id by matching owner_id
    let organizationRefId = null
    await faunaClient
      .query(
        q.Paginate(q.Match(q.Index('organizations_by_owner_id'), userRefId))
      )
      .then((ret) => {
        let indexSearchResult = ret.data
        organizationRefId = indexSearchResult[0].id
      })
      .catch((err) => {
        res.status(422).json([{ key: 'general', values: err.description }])
        return
      })

    // get organization record by organization ref id
    let organization = null
    await faunaClient
      .query(q.Get(q.Ref(q.Collection('organizations'), organizationRefId)))
      .then((ret) => {
        organization = ret.data
      })
      .catch((err) => {
        res.status(422).json([{ key: 'general', values: err.description }])
        return
      })

    // build response
    let organizationForm = new OrganizationForm({
      org_name: organization.name,
      street_address: organization.street_address,
      state: organization.state,
      city: organization.city,
      zip_code: organization.zip_code,
      country: organization.country,
      timezone: organization.timezone,
      office_number: organization.office_number,
      office_email: organization.office_email,
      org_type: organization.org_type,
      org_affiliation: organization.org_affiliation,
      method_of_communication: organization.method_of_communication,
      language_of_communication: organization.language_of_communication,

      title: user.title,
      first_name: user.first_name,
      last_name: user.last_name,
      pronoun: user.pronoun,
      org_position: user.org_position,
      mobile_number: user.mobile_number,
      email: user.email,
      status: user.status,
      role: user.role,
      heard_about: user.heard_about,
      is_subscribe: user.is_subscribe,
    })

    res.status(200).json(organizationForm)
    return
  }
}

export default handler
