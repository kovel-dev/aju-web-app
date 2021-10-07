import moment from 'moment'
import User from '../../../../lib/models/user'
import { query as q } from 'faunadb'
import { faunaClient } from '../../../../lib/config/fauna'
import { validateUserForm } from '../../../../lib/validations/user-validations'
import { getSession } from 'next-auth/client'

async function handler(req, res) {
  if (req.method == 'POST') {
    const session = await getSession({ req: req })

    if (!session) {
      res.status(401).json([{ key: 'general', values: 'Not Authenticated' }])
      return
    }

    const data = req.body
    const userRefNumber = req.query.id

    // get the current user
    const currentUserRefNumber = session.user.id

    // validate user inputs
    await validateUserForm(data)
      .then(async (value) => {
        // process partner org linking if role is partner
        if (data.role == 'partner') {
          if (data.linked_org && data.linked_org.length > 0) {
            // check if current user already own an organization
            // if already owned then removed ownership on that organization(s) else do nothing
            try {
              await faunaClient.query(
                q.Map(
                  q.Paginate(
                    q.Match(q.Index('organizations_by_owner_status'), [
                      userRefNumber,
                      'active',
                    ])
                  ),
                  q.Lambda(
                    'i',
                    q.Update(
                      q.Ref(
                        q.Collection('organizations'),
                        q.Select(['ref', 'id'], q.Get(q.Var('i')))
                      ),
                      {
                        data: { owner_id: '' },
                      }
                    )
                  )
                )
              )
            } catch (error) {
              res
                .status(422)
                .json([{ key: 'general', values: error.description }])
              return
            }

            // update the organization to be linked to
            try {
              await faunaClient.query(
                q.Update(
                  q.Ref(q.Collection('organizations'), data.linked_org),
                  {
                    data: { owner_id: userRefNumber },
                  }
                )
              )
            } catch (error) {
              res
                .status(422)
                .json([{ key: 'general', values: error.description }])
              return
            }
          }
        } else if (['staff', 'admin', 'student'].indexOf(data.role) > -1) {
          try {
            await faunaClient.query(
              q.Map(
                q.Paginate(
                  q.Match(q.Index('organizations_by_owner_status'), [
                    userRefNumber,
                    'active',
                  ])
                ),
                q.Lambda(
                  'i',
                  q.Update(
                    q.Ref(
                      q.Collection('organizations'),
                      q.Select(['ref', 'id'], q.Get(q.Var('i')))
                    ),
                    {
                      data: { owner_id: '' },
                    }
                  )
                )
              )
            )
          } catch (error) {
            res
              .status(422)
              .json([{ key: 'general', values: error.description }])
            return
          }
        }

        let user = new User(data)
        let newUserObj = user.getValues()

        // empty out the fields not related to the role
        if (newUserObj.role == 'partner') {
          newUserObj.state = ''
          newUserObj.city = ''
          newUserObj.zipcode = ''
          newUserObj.country = ''
          newUserObj.communication_method = ''
          newUserObj.communication_language = ''
          newUserObj.affiliation_other = ''
          newUserObj.affiliation_id = ''
          newUserObj.affiliation_name = ''
          newUserObj.card_meta = ''
          newUserObj.cart_meta = ''
          newUserObj.waitlist_meta = ''
        } else if (newUserObj.role == 'student') {
          newUserObj.org_position = ''
        } else if (['staff', 'admin'].indexOf(newUserObj.role) > -1) {
          newUserObj.title = ''
          newUserObj.pronoun = ''
          newUserObj.mobile_number = ''
          newUserObj.state = ''
          newUserObj.city = ''
          newUserObj.zipcode = ''
          newUserObj.country = ''
          newUserObj.communication_method = ''
          newUserObj.communication_language = ''
          newUserObj.affiliation_other = ''
          newUserObj.heard_about = ''
          newUserObj.is_subscribe = ''
          newUserObj.timezone = ''
          newUserObj.org_position = ''
          newUserObj.affiliation_id = ''
          newUserObj.affiliation_name = ''
          newUserObj.card_meta = ''
          newUserObj.cart_meta = ''
          newUserObj.waitlist_meta = ''
        }

        // update the user information
        newUserObj.updated_by = currentUserRefNumber
        newUserObj.updated_at = moment().format('YYYY-MM-DD HH:mm:ss')

        await faunaClient
          .query(
            q.Update(q.Ref(q.Collection('users'), userRefNumber), {
              data: newUserObj,
            })
          )
          .then((result) => {
            res.status(200).json([{ message: 'User updated!' }])
            return
          })
          .catch(async (err) => {
            console.log(err)
            res.status(422).json([{ key: 'general', values: err.description }])
            return
          })
      }) // validateSignUp end
      .catch(function (err) {
        console.log(err)
        res.status(422).json(err)
        return
      })
  }
}

export default handler
