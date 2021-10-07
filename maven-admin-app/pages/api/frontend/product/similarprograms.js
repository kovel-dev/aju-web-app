import Cors from 'cors'
import corsMiddleware from '../../../../lib/middleware/cors'
import { query as q } from 'faunadb'
import { getSession } from 'next-auth/client'
import { faunaClient } from '../../../../lib/config/fauna'
import moment from 'moment'
import { formatProgramsCardData } from '../../../../lib/handlers/helper-handlers'

// Initializing the cors middleware
const cors = corsMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    origin: [process.env.NEXT_PUBLIC_FRONTEND_API_URL],
    methods: ['POST'],
  })
)

async function handler(req, res) {
  await cors(req, res)

  if (req.method == 'POST') {
    /**
     * @Ref: https://dev.to/pierb/getting-started-with-fql-faunadb-s-native-query-language-part-1-2069
     * @Ref: https://docs.fauna.com/fauna/current/tutorials/indexes/pagination.html?lang=javascript
     * */

    const data = req.body

    //Get Web URL
    const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_API_URL

    const currentDT = moment
      .utc(moment(new Date(), 'yyyy-MM-DD HH:mm:ss'))
      .valueOf()

    if (data.tags.length > 0) {
      let filtersParams = { tags: data.tags, progRef: data.progRef }
      //Find Events based on similar tags
      let filterResultSet = await faunaClient
        .query(
          q.Let(
            filtersParams,
            q.Map(
              q.Paginate(
                q.Filter(
                  q.Join(
                    q.Union(
                      q.Map(
                        q.Var('tags'),
                        q.Lambda(
                          ['tag'],
                          q.Match(q.Index('products_by_tag_id'), q.Var('tag'))
                        )
                      )
                    ),
                    q.Index('products_sort_by_startdate_asc')
                  ),
                  q.Lambda(
                    ['startDt', 'ref'],
                    q.And(
                      q.LTE(
                        q.Select(
                          ['data', 'millisecondRegistrationStartDt'],
                          q.Get(q.Var('ref'))
                        ),
                        currentDT
                      ),
                      q.GTE(
                        q.Select(
                          ['data', 'millisecondRegistrationEndDt'],
                          q.Get(q.Var('ref'))
                        ),
                        currentDT
                      ),
                      q.If(
                        q.Equals(
                          q.Var('ref'),
                          q.Ref(q.Collection('products'), q.Var('progRef'))
                        ),
                        false,
                        true
                      ),
                      q.If(
                        q.Equals(
                          q.Select(['data', 'type'], q.Get(q.Var('ref'))),
                          'on-demand'
                        ),
                        false,
                        true
                      )
                    )
                  )
                ),
                { size: 3 }
              ),
              q.Lambda(['startDt', 'ref'], {
                img: q.Select(['data', 'imageUrl'], q.Get(q.Var('ref'))),
                link: q.Select(['data', 'slug'], q.Get(q.Var('ref'))),
                type: q.Select(['data', 'type'], q.Get(q.Var('ref'))),
                eventStartDate: q.Select(
                  ['data', 'startDt'],
                  q.Get(q.Var('ref'))
                ),
                price: q.Select(['data', 'price'], q.Get(q.Var('ref'))),
                title: q.Select(['data', 'name'], q.Get(q.Var('ref'))),
                description: q.Select(
                  ['data', 'shortDescription'],
                  q.Get(q.Var('ref'))
                ),
              })
            )
          )
        )
        .then((result) => {
          //Programs Found, Filter them based on their types
          let resultSimilarPrograms = []

          result.data.map((program) => {
            let tempProg = {}
            tempProg['title'] = program['title']
            tempProg['img'] = program['img']
            tempProg['link'] =
              FRONTEND_URL + '/events-classes/program/' + program['link']
            tempProg['description'] = program['description']

            if (program['type'] == 'event' || program['type'] == 'class') {
              tempProg['month'] = moment(program['eventStartDate']).format(
                'MMM'
              )
              tempProg['day'] = moment(program['eventStartDate']).format('DD')
              tempProg['free'] = parseInt(program['price']) < 1 ? true : false
            } else if (program['type'] == 'on-demand') {
              //on-demand parameters
            } else {
              //class or series
              // tempProg['label'] = 'select'
            }
            resultSimilarPrograms.push(tempProg)
          })

          return res.status(200).json(resultSimilarPrograms)
        })
        .catch((err) => {
          return res.status(500).json([{ key: 'error', values: err.message }])
        })
    } else {
      //Find events based on upcoming programs as no tags attached to program
      let filterResultSet = await faunaClient
        .query(
          q.Map(
            q.Paginate(
              q.Filter(
                q.Join(
                  q.Match(q.Index('products_status_isreserved'), [
                    'published',
                    'no',
                  ]),
                  q.Index('products_sort_by_startdate_asc')
                ),
                q.Lambda(
                  ['startDt', 'ref'],
                  q.And(
                    q.LTE(
                      q.Select(
                        ['data', 'millisecondRegistrationStartDt'],
                        q.Get(q.Var('ref'))
                      ),
                      currentDT
                    ),
                    q.GTE(
                      q.Select(
                        ['data', 'millisecondRegistrationEndDt'],
                        q.Get(q.Var('ref'))
                      ),
                      currentDT
                    ),
                    q.If(
                      q.Equals(
                        q.Select(['data', 'type'], q.Get(q.Var('ref'))),
                        'on-demand'
                      ),
                      false,
                      true
                    )
                  )
                )
              ),
              { size: 3 }
            ),
            q.Lambda(['startDt', 'ref'], {
              img: q.Select(['data', 'imageUrl'], q.Get(q.Var('ref'))),
              link: q.Select(['data', 'slug'], q.Get(q.Var('ref'))),
              type: q.Select(['data', 'type'], q.Get(q.Var('ref'))),
              eventStartDate: q.Select(
                ['data', 'startDt'],
                q.Get(q.Var('ref'))
              ),
              price: q.Select(['data', 'price'], q.Get(q.Var('ref'))),
              title: q.Select(['data', 'name'], q.Get(q.Var('ref'))),
              description: q.Select(
                ['data', 'shortDescription'],
                q.Get(q.Var('ref'))
              ),
            })
          )
        )
        .then((result) => {
          //Programs Found, Filter them based on their types
          let resultSimilarPrograms = []

          result.data.map((program) => {
            let tempProg = {}
            tempProg['title'] = program['title']
            tempProg['img'] = program['img']
            tempProg['link'] =
              FRONTEND_URL + '/events-classes/program/' + program['link']
            tempProg['description'] = program['description']

            if (program['type'] == 'event' || program['type'] == 'class') {
              tempProg['month'] = moment(program['eventStartDate']).format(
                'MMM'
              )
              tempProg['day'] = moment(program['eventStartDate']).format('DD')
              tempProg['free'] = parseInt(program['price']) < 1 ? true : false
            } else if (program['type'] == 'on-demand') {
              //on-demand parameters
            } else {
              //class or series
              // tempProg['label'] = 'select'
            }
            resultSimilarPrograms.push(tempProg)
          })

          return res.status(200).json(resultSimilarPrograms)
        })
        .catch((err) => {
          return res.status(500).json([{ key: 'error', values: err.message }])
        })
    }
  } else {
    return res.status(405).json([{ key: 'general', values: 'Invalid Call' }])
  }
}

export default handler
