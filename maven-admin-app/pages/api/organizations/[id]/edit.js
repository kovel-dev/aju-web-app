import moment from 'moment'
import User from '../../../../lib/models/user'
import Organization from '../../../../lib/models/organization'
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

    const currentUserRefNumber = session.user.id
    const data = req.body
    let organizationId = req.query.id
    let organization = new Organization(data)

    // Validate organization input
    try {
      await organization.validate()
    } catch (error) {
      res.status(422).json(error)
      return
    }

    // remove ownership from other organization
    if (organization.owner_id.length > 0) {
      try {
        await faunaClient.query(
          q.Map(
            q.Filter(
              q.Paginate(
                q.Match(
                  q.Index('organizations_by_owner_id'),
                  organization.owner_id
                )
              ),
              q.Lambda(
                'i',
                q.And(
                  q.If(
                    q.Not(
                      q.Equals(
                        q.Select(['ref', 'id'], q.Get(q.Var('i'))),
                        organizationId
                      )
                    ),
                    true,
                    false
                  )
                )
              )
            ),
            q.Lambda(
              'i',
              q.Update(
                q.Ref(
                  q.Collection('organizations'),
                  q.Select(['ref', 'id'], q.Get(q.Var('i')))
                ),
                {
                  data: {
                    owner_id: '',
                    updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
                    updated_by: currentUserRefNumber,
                  },
                }
              )
            )
          )
        )
      } catch (error) {
        res.status(422).json([{ key: 'general', values: error.description }])
        return
      }
    }

    // update create and update details
    organization.updated_at = moment().format('YYYY-MM-DD HH:mm:ss')
    organization.updated_by = currentUserRefNumber

    // save/update organization
    try {
      return await faunaClient
        .query(
          q.Update(q.Ref(q.Collection('organizations'), organizationId), {
            data: organization.getValues(),
          })
        )
        .then((result) => {
          res.status(200).json({ message: 'Updated organization!' })
          return
        })
    } catch (error) {
      res.status(422).json([{ key: 'general', values: error.description }])
      return
    }
  }
}

export default handler
