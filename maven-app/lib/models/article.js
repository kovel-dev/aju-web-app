import axios from 'axios'

class Article {
  getList = async () => {
    return await axios
      .get(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/in-the-press/list`)
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error.response.data
      })
  }
}

export default Article
