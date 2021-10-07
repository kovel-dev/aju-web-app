import Cors from 'cors'
import corsMiddleware from '../../../../lib/middleware/cors'
import moment from 'moment'
import Organization from '../../../../lib/models/organization'
import User from '../../../../lib/models/user'
import OrganizationForm from '../../../../lib/models/frontend/organization-form'
import { query as q } from 'faunadb'
import { faunaClient } from '../../../../lib/config/fauna'
import { getToken, trimObj } from '../../../../lib/handlers/helper-handlers'
import { hashPassword } from '../../../../lib/middleware/auth'
import { sendEmail } from '../../../../lib/mail/mail'

// Initializing the cors middleware
const cors = corsMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    origin: [process.env.NEXT_PUBLIC_FRONTEND_API_URL],
    methods: ['POST'],
  })
)

async function handler(req, res) {
  // Run the middleware
  await cors(req, res)

  if (req.method == 'POST') {
    const data = req.body

    const { email } = data

    try {
      // If user has already been used, respond with error message
      await faunaClient
        .query(q.Get(q.Match(q.Index('users_by_email'), email)))
        .then((result) => {
          res
            .status(422)
            .json([
              { key: 'email', values: 'Sorry email has already been used!' },
            ])
          return
        })
    } catch (error) {
      if (error.requestResult.statusCode == 404) {
        // initialize received request data
        let organizationForm = new OrganizationForm(data)

        // validate the request data
        try {
          await organizationForm.validateFEOrganizationForm()
        } catch (error) {
          console.log(error)
          res.status(422).json(error)
          return
        }

        // remove excess spaces on values
        let trimModel = trimObj(organizationForm.getValues())

        // initialize user value
        let userModel = new User({
          title: trimModel.title,
          pronoun: trimModel.pronoun,
          first_name: trimModel.first_name,
          last_name: trimModel.last_name,
          email: trimModel.email,
          mobile_number: trimModel.mobile_number,
          // set status as inactive
          status: 'inactive',
          // set status as partner
          role: 'partner',
          org_position: trimModel.org_position,
          heard_about: trimModel.heard_about,
          is_subscribe: trimModel.is_subscribe,
          accepted_term_and_conditions: trimModel.accepted_term_and_conditions,
          is_verified: false,
          verification_token: getToken(),
        })

        // get complete model structure with values appended and set it to a variable
        let newUserObj = userModel.getValues()
        // set the password
        newUserObj['password'] = await hashPassword(trimModel.password)

        // process Users record
        let faunaUserRes = null
        try {
          await faunaClient
            .query(q.Create(q.Collection('users'), { data: newUserObj }))
            .then(async (result) => {
              faunaUserRes = result
              return
            })
        } catch (error) {
          res.status(422).json([{ key: 'general', values: error.description }])
          return
        }

        // if user create has error return an error message
        if (faunaUserRes == null) {
          res.status(422).json([
            {
              key: 'general',
              values: 'Sorry something went wrong saving your user information',
            },
          ])
          return
        }

        // initialize organization model
        let orgModel = new Organization(trimModel)
        // get complete model structure with values appended and set it to a variable
        let newOrgModel = orgModel.getValues()
        // set owner_id with user's ref id
        newOrgModel['owner_id'] = faunaUserRes.ref.id
        // set the org as inactive needed for approval
        newOrgModel['status'] = 'inactive'

        // process Organization record
        let faunaOrgRes = null
        try {
          await faunaClient
            .query(
              q.Create(q.Collection('organizations'), { data: newOrgModel })
            )
            .then(async (result) => {
              faunaOrgRes = result
              return
            })
        } catch (error) {
          res.status(422).json([{ key: 'general', values: error.description }])
          return
        }

        // if org creation has issue delete the user record and return an error message
        if (faunaOrgRes == null) {
          // Delete user record
          await faunaClient.query(
            q.Delete(q.Ref(q.Collection('users'), faunaUserRes.ref.id))
          )

          res.status(422).json([
            {
              key: 'general',
              values:
                'Sorry something went wrong saving your organization information',
            },
          ])
          return
        }

        // Send email verification
        let hasSend = true
        let successMsg = { message: 'Organization created successfully!' }
        try {
          await sendEmail(
            'fe-organization-registration',
            userModel.getValues()
          ).then((response) => {
            hasSend = response
          })
        } catch (error) {
          hasSend = false
        }

        if (!hasSend) {
          successMsg = {
            message: 'Organization created but failed to submit welcome email.',
          }
        }

        // Send email notification to admin
        if (process.env.IS_SEND_TO_ADMIN == 'true') {
          try {
            await sendEmail('fe-admin-org-req', userModel.getValues())
          } catch (error) {
            // make a log process here to record error
          }
        }

        // success!
        res.status(200).json(successMsg)
      } else {
        /**
         * @Note: Add file log for other error - err.description
         * We dont want to show the specific error especially FaunaDB error
         * */

        res.status(500).json([
          {
            key: 'general',
            values: 'Sorry but something went wrong processing your request!',
          },
        ])
        return
      }
    }
  }
}

export default handler
