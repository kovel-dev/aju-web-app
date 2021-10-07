import moment from 'moment'
import { query as q } from 'faunadb'
import { faunaClient } from '../config/fauna'
import { server } from '../config/server'
import { boolean } from 'yup/lib/locale'

export const getPageData = async (page) => {
  let pageData = await faunaClient
    .query(q.Get(q.Match(q.Index('get_page_by_name'), page)))
    .then((result) => {
      //Page Exist, Get its Data
      return result.data.pageData
    })
    .catch(() => {
      return false
    })
  return pageData
}

// Function to Check if user has purchased the given program or not
// Param:
// programId : Program Ref #
// userId : user Ref #
// returnValue : user Ref #

export const checkProgramEntitlement = async (
  programId,
  userId,
  type = 'boolean'
) => {
  let product = await faunaClient
    .query(
      q.Paginate(
        q.Match(q.Index('attendee_productid_userid_status'), [
          programId,
          userId,
          'active',
        ])
      )
    )
    .then((result) => {
      //Program Exist
      if (type == 'boolean') {
        return result.data.length > 0 ? true : false
      } else {
        return result.data.length > 0 ? Object.values(result.data[0]) : []
      }
    })
    .catch((err) => {
      console.log(err, 'err')
      return false
    })
  return product
}

export const getProductBySlug = async (slug) => {
  let product = await faunaClient
    .query(
      q.Map(
        q.Paginate(q.Match(q.Index('products_by_slug'), slug)),
        q.Lambda(['ref'], q.Get(q.Var('ref')))
      )
    )
    .then((result) => {
      //Program Exist
      return result.data.length > 0 ? result.data[0] : false
    })
    .catch((err) => {
      console.log(err, 'err')
      return false
    })
  return product
}

export const getFeaturedTags = async (tagReferences) => {
  let pageData = await faunaClient
    .query(
      q.Map(
        tagReferences,
        q.Lambda('refID', q.Get(q.Ref(q.Collection('tags'), q.Var('refID'))))
      )
    )
    .then((result) => {
      //Page Exist, Get its Data
      let tags = {}
      tags = result.map((tag) => {
        return {
          label: tag.data.name,
          img: tag.data.desktop_image_url,
          link: server + '/tags/' + tag.data.slug,
        }
      })
      return tags
    })
    .catch((err) => {
      console.log(err, 'err')
      return false
    })
  return pageData
}

export const getUpcomingEvents = async (
  paginateSize = 3,
  programIdsVisible = null
) => {
  const currentDT = moment.utc(moment().format('yyyy-MM-DD HH:mm:ss')).valueOf()
  let filter = q.And(
    q.LTE(
      q.Select(['data', 'millisecondRegistrationStartDt'], q.Get(q.Var('ref'))),
      currentDT
    ),
    q.GTE(
      q.Select(['data', 'millisecondRegistrationEndDt'], q.Get(q.Var('ref'))),
      currentDT
    )
  )

  // filter to not include the same program on the result, programIdsVisible are program ids that showing in the page
  if (programIdsVisible !== null) {
    filter = q.And(
      q.LTE(
        q.Select(
          ['data', 'millisecondRegistrationStartDt'],
          q.Get(q.Var('ref'))
        ),
        currentDT
      ),
      q.GTE(
        q.Select(['data', 'millisecondRegistrationEndDt'], q.Get(q.Var('ref'))),
        currentDT
      ),
      q.Not(
        q.ContainsValue(
          q.Select(['ref', 'id'], q.Get(q.Var('ref'))),
          programIdsVisible
        )
      )
    )
  }

  let pageData = await faunaClient
    .query(
      q.Map(
        q.Paginate(
          q.Filter(
            q.Join(
              q.Match(q.Index('products_for_users'), [
                'event',
                'published',
                'no',
              ]),
              q.Index('products_sort_by_startdate_asc')
            ),
            q.Lambda(['startDt', 'ref'], filter)
          ),
          { size: paginateSize }
        ),
        q.Lambda(['startDt', 'ref'], {
          img: q.Select(['data', 'imageUrl'], q.Get(q.Var('ref'))),
          link: q.Select(['data', 'slug'], q.Get(q.Var('ref'))),
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
      //Events found. Process Dates and price
      let events = {}
      events = result.data.map((event) => {
        event['month'] = moment(event['eventStartDate']).format('MMM')
        event['day'] = moment(event['eventStartDate']).format('DD')
        event['free'] = parseInt(event['price']) < 1 ? true : false
        event['link'] = server + '/events-classes/program/' + event['link']

        if (event['img'].length <= 0) {
          event[
            'img'
          ] = `${process.env.NEXT_PUBLIC_APP_URL}/images/class-default.jpg`
        }
        return event
      })
      return events
    })
    .catch((error) => {
      return false
    })
  return pageData
}

export const getFeaturedPrograms = async (eventType, paginateSize) => {
  const currentDT = moment.utc(moment().format('yyyy-MM-DD HH:mm:ss')).valueOf()
  let query = q.Map(
    q.Paginate(
      q.Filter(
        q.Match(q.Index('products_for_users'), [eventType, 'published', 'no']),
        q.Lambda(
          ['ref'],
          q.And(
            q.LTE(
              currentDT,
              q.Select(['data', 'millisecondEndDt'], q.Get(q.Var('ref')))
            ),
            q.Equals(
              q.Select(['data', 'isFeatured'], q.Get(q.Var('ref'))),
              'yes'
            )
          )
        )
      ),
      { size: paginateSize }
    ),
    q.Lambda(['ref'], q.Get(q.Var('ref')))
  )

  if (eventType == 'class-series') {
    query = q.Map(
      q.Paginate(
        q.Filter(
          q.Union(
            q.Match(q.Index('products_for_users'), [
              'class',
              'published',
              'no',
            ]),
            q.Match(q.Index('products_for_users'), [
              'series',
              'published',
              'no',
            ])
          ),
          q.Lambda(
            ['ref'],
            q.And(
              q.LTE(
                currentDT,
                q.Select(['data', 'millisecondEndDt'], q.Get(q.Var('ref')))
              ),
              q.Equals(
                q.Select(['data', 'isFeatured'], q.Get(q.Var('ref'))),
                'yes'
              )
            )
          )
        ),
        { size: paginateSize }
      ),
      q.Lambda(['ref'], q.Get(q.Var('ref')))
    )
  }

  let resData = await faunaClient
    .query(query)
    .then((result) => {
      //Events found. Process Dates and price
      let data = {}
      data = result.data.map((event) => {
        let tempData = {}

        tempData['img'] = event.data['imageUrl']
          ? event.data['imageUrl']
          : `${process.env.NEXT_PUBLIC_APP_URL}/images/class-default.jpg`
        tempData['link'] =
          server + '/events-classes/program/' + event.data['slug']
        tempData['title'] = event.data['name'] ? event.data['name'] : ''
        tempData['description'] = event.data['shortDescription']
          ? event.data['shortDescription']
          : ''
        tempData['month'] = moment(event.data['startDt']).format('MMM')
        tempData['day'] = moment(event.data['startDt']).format('DD')
        tempData['millisecondStartDt'] = event.data['millisecondStartDt']
        tempData['free'] = parseInt(event.data['price']) < 1 ? true : false

        // if (eventType !== 'event') {
        //   tempData['label'] = 'Select'
        // }

        return tempData
      })

      // sort asc
      if (data.length > 0) {
        data = data.sort((a, b) => a.millisecondStartDt - b.millisecondStartDt)
      }

      return data
    })
    .catch((e) => {
      console.log(e, 'eee')
      return false
    })
  return resData
}

export const getActiveHosts = async () => {
  let pageData = await faunaClient
    .query(
      q.Filter(
        q.Paginate(q.Match(q.Index('hosts')), { size: 100000 }),
        q.Lambda('i', q.Equals('active', q.Select(6, q.Var('i'))))
      )
    )
    .then((result) => {
      const data = result.data
      let hosts = []
      if (data.length > 0) {
        for (let index = 0; index < data.length; index++) {
          const host = data[index]

          // refer to hosts index to search for index of each field
          hosts.push({
            key: host[8].value.id,
            value: host[0],
          })
        }
      }

      if (hosts.length > 0) {
        hosts.sort((a, b) => a.value.localeCompare(b.value))
      }

      return hosts
    })
    .catch((e) => {
      return false
    })
  return pageData
}

export const getAllActiveTags = async () => {
  let allTags = await faunaClient
    .query(
      q.Filter(
        q.Paginate(q.Match(q.Index('tags')), { size: 100000 }),
        q.Lambda('i', q.Equals('active', q.Select(6, q.Var('i'))))
      )
    )
    .then((result) => {
      const data = result.data
      let tags = []
      if (data.length > 0) {
        for (let index = 0; index < data.length; index++) {
          const tag = data[index]

          // refer to hosts index to search for index of each field
          tags.push({
            key: tag[7].value.id,
            value: tag[0],
          })
        }
      }
      return tags
    })
    .catch((e) => {
      return false
    })
  return allTags
}

export const getActiveTags = async () => {
  let pageData = await faunaClient
    .query(
      q.Map(
        q.Paginate(q.Match(q.Index('tags_featured'), ['yes', 'active']), {
          size: 100000000,
        }),
        q.Lambda(['ref'], {
          name: q.Select(['data', 'name'], q.Get(q.Var('ref'))),
          ref: q.Select(['ref'], q.Get(q.Var('ref'))),
        })
      )
    )
    .then(async (result) => {
      const finalTags = []
      result.data.map((tags) => {
        finalTags.push({
          name: tags.name,
          value: tags.name,
          key: tags.ref.value.id,
          // category: true,
        })
      })

      if (finalTags.length > 0) {
        finalTags.sort((a, b) => a.name.localeCompare(b.name))
      }

      return finalTags
    })
    .catch((e) => {
      console.log(e, 'error')
      return false
    })

  return pageData
}

export const getAssetData = async (imgUrl) => {
  let resData = await faunaClient
    .query(
      q.Map(
        q.Paginate(q.Match(q.Index('asset_by_url'), imgUrl)),
        q.Lambda(['ref'], q.Get(q.Var('ref')))
      )
    )
    .then((result) => {
      //Events found. Process Dates and price
      let data = {}
      data = result.data[0]
      return data
    })
    .catch((err) => {
      console.log(err, 'err')
      return false
    })
  return resData
}

export const getTag = async (slug) => {
  let pageData = await faunaClient
    .query(
      q.Map(
        q.Paginate(q.Match(q.Index('tags_by_slug'), [slug, 'active']), {
          size: 100000000,
        }),
        q.Lambda(['ref'], q.Get(q.Var('ref')))
      )
    )
    .then(async (result) => {
      let data = {}
      data = result.data[0]
      return data
    })
    .catch((e) => {
      console.log(e, 'error')
      return false
    })

  return pageData
}

export const isOnWaitlist = async (productId, userId) => {
  let isOnWaitlist = await faunaClient
    .query(q.Get(q.Ref(q.Collection('users'), userId)))
    .then((ret) => {
      return ret.data.waitlist_meta.indexOf(productId) > -1
    })
    .catch((err) => {
      console.log(err, 'error')
      return false
    })

  return isOnWaitlist
}
