import { query as q } from 'faunadb'
import { faunaClient } from '../../lib/config/fauna'

class Pages {
  constructor() {}

  getPagesData = async (page) => {
    let pageData = await faunaClient
      .query(q.Get(q.Match(q.Index('get_page_by_name'), page)))
      .then((result) => {
        //Page Exist, Get its Data
        return result.data.pageData
      })
      .catch((err) => {
        return false
      })
    return pageData
  }
}

export default Pages
