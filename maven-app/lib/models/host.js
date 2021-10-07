import axios from 'axios'

class Host {
  getList = async () => {
    return await axios
      .get(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/host/list`)
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error.response.data
      })
  }

  getListBySearch = async (categories, keyword) => {
    return await axios
      .post(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/host/search`, {
        keyword: keyword,
        categories: categories,
      })
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error.response.data
      })
  }
}

export default Host
