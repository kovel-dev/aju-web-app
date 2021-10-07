import Cors from 'cors'
import corsMiddleware from '../../../../lib/middleware/cors'
import { query as q } from 'faunadb'
import { faunaClient } from '../../../../lib/config/fauna'
import moment from 'moment'
import { server } from '../../../../lib/config/server'

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
    const { type } = req.body

    const currentDT = moment
      .utc(moment().format('yyyy-MM-DD HH:mm:ss'))
      .valueOf()

    let matchQuery = ''
    if (type == 'class-series') {
      matchQuery = q.Union(
        q.Match(q.Index('products_for_users'), ['class', 'published', 'no']),
        q.Match(q.Index('products_for_users'), ['series', 'published', 'no'])
      )
    } else {
      matchQuery = q.Match(q.Index('products_for_users'), [
        type,
        'published',
        'no',
      ])
    }

    let pageData = await faunaClient
      .query(
        q.Map(
          q.Paginate(
            q.Filter(
              q.Join(matchQuery, q.Index('products_sort_by_startdate_asc')),
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
                  )
                )
              )
            ),
            { size: 100000 }
          ),
          q.Lambda(['startDt', 'ref'], {
            img: q.Select(['data', 'imageUrl'], q.Get(q.Var('ref'))),
            slug: q.Select(['data', 'slug'], q.Get(q.Var('ref'))),
            eventStartDate: q.Select(['data', 'startDt'], q.Get(q.Var('ref'))),
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
        if (type == 'event' || type == 'class' || type == 'class-series') {
          let events = {}
          events = result.data.map((event) => {
            event['imageUrl'] = event['imageUrl']
              ? event['imageUrl']
              : `${process.env.NEXT_PUBLIC_FRONTEND_API_URL}/images/class-default.jpg`
            event['month'] = moment(event['eventStartDate']).format('MMM')
            event['day'] = moment(event['eventStartDate']).format('DD')
            event['free'] = parseInt(event['price']) < 1 ? true : false
            event['link'] = '/events-classes/program/' + event['slug']
            return event
          })
          return events
        } else {
          let events = {}
          events = result.data.map((event) => {
            event['link'] = '/events-classes/program/' + event['slug']
            return event
          })
          return events
        }
      })
      .catch((e) => {
        console.log(e, 'error')
        return false
      })
    res.status(200).json(pageData)
    return
  }
}

export default handler
