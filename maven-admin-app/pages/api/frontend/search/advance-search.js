import Cors from 'cors'
import corsMiddleware from '../../../../lib/middleware/cors'
import { query as q } from 'faunadb'
import { getSession } from 'next-auth/client'
import { faunaClient } from '../../../../lib/config/fauna'
import moment from 'moment'

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

    const data = req.body.params
    //Get Web URL
    const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_API_URL

    //Build params for Query
    let filtersParams = {
      tagRef: data.tagRef ? data.tagRef : null,
      hostRef: data.hostRef ? data.hostRef : null,
      type: data.type ? data.type : null,
      level: data.level ? data.level : null,
      deliveryType: data.deliveryType ? data.deliveryType : null,
      sponsorRef: data.sponsorRef ? data.sponsorRef : null,
      searchText: data.searchText ? data.searchText.split('_').join(' ') : null,
    }

    const resultSetSeperated = data.seperate ? true : false

    const currentDT = moment
      .utc(moment().format('yyyy-MM-DD HH:mm:ss'))
      .valueOf()

    let filterResultSet = await faunaClient
      .query(
        q.Let(
          filtersParams,
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
                      q.IsNull(q.Var('tagRef')),
                      true,
                      q.ContainsValue(
                        q.Var('ref'),
                        q.Match(q.Index('products_by_tag_id'), q.Var('tagRef'))
                      )
                    ),
                    q.If(
                      q.IsNull(q.Var('hostRef')),
                      true,
                      q.ContainsValue(
                        q.Var('ref'),
                        q.Match(
                          q.Index('products_by_host_id'),
                          q.Var('hostRef')
                        )
                      )
                    ),
                    q.If(
                      q.IsNull(q.Var('sponsorRef')),
                      true,
                      q.ContainsValue(
                        q.Var('ref'),
                        q.Match(
                          q.Index('products_by_sponsor_id'),
                          q.Var('sponsorRef')
                        )
                      )
                    ),
                    q.If(
                      q.IsNull(q.Var('type')),
                      true,
                      q.Equals(
                        q.Var('type'),
                        q.Select(['data', 'type'], q.Get(q.Var('ref')))
                      )
                    ),
                    q.If(
                      q.IsNull(q.Var('level')),
                      true,
                      q.Equals(
                        q.Var('level'),
                        q.Select(['data', 'level'], q.Get(q.Var('ref')))
                      )
                    ),
                    q.If(
                      q.IsNull(q.Var('deliveryType')),
                      true,
                      q.Equals(
                        q.Var('deliveryType'),
                        q.Select(['data', 'deliveryType'], q.Get(q.Var('ref')))
                      )
                    ),
                    q.If(
                      q.IsNull(q.Var('searchText')),
                      true,
                      q.Or(
                        q.ContainsStr(
                          q.LowerCase(
                            q.Select(['data', 'name'], q.Get(q.Var('ref')))
                          ),
                          q.LowerCase(q.Var('searchText'))
                        ),
                        q.ContainsStr(
                          q.LowerCase(
                            q.Select(
                              ['data', 'shortDescription'],
                              q.Get(q.Var('ref'))
                            )
                          ),
                          q.LowerCase(q.Var('searchText'))
                        ),
                        q.ContainsStr(
                          q.LowerCase(
                            q.Select(
                              ['data', 'subtagMetaString'],
                              q.Get(q.Var('ref')),
                              ''
                            )
                          ),
                          q.LowerCase(q.Var('searchText'))
                        )
                      )
                    )
                  )
                )
              )
            ),
            q.Lambda(['startDt', 'ref'], {
              title: q.Select(['data', 'name'], q.Get(q.Var('ref'))),
              img: q.Select(['data', 'imageUrl'], q.Get(q.Var('ref'))),
              link: q.Select(['data', 'slug'], q.Get(q.Var('ref'))),
              programType: q.Select(['data', 'type'], q.Get(q.Var('ref'))),
              eventStartDate: q.Select(
                ['data', 'startDt'],
                q.Get(q.Var('ref'))
              ),
              price: q.Select(['data', 'price'], q.Get(q.Var('ref'))),
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
        let events = []
        let classes = []
        let onDemands = []
        let finalResultSet = []

        result.data.map((program) => {
          let tempProg = {}
          tempProg['title'] = program['title']
          tempProg['img'] = program['img']
          tempProg['link'] =
            FRONTEND_URL + '/events-classes/program/' + program['link']
          tempProg['description'] = program['description']

          if (
            program['programType'] == 'event' ||
            program['programType'] == 'class'
          ) {
            tempProg['month'] = moment(program['eventStartDate']).format('MMM')
            tempProg['day'] = moment(program['eventStartDate']).format('DD')
            tempProg['free'] = parseInt(program['price']) < 1 ? true : false
            events.push(tempProg)
          } else if (program['programType'] == 'on-demand') {
            //on-demand parameters
            onDemands.push(tempProg)
          } else {
            //class or series
            // tempProg['label'] = 'select'
            classes.push(tempProg)
          }
          if (!resultSetSeperated) {
            finalResultSet.push(tempProg)
          }
        })

        if (!resultSetSeperated) {
          res.status(200).json({
            results: finalResultSet,
          })
        } else {
          res.status(200).json({
            events: events,
            classes: classes,
            onDemands: onDemands,
          })
        }

        return
      })
      .catch((err) => {
        return res.status(500).json([{ key: 'error', values: err.message }])
      })
  } else {
    return res.status(405).json([{ key: 'general', values: 'Invalid Call' }])
  }
}

export default handler
