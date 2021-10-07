import axios from 'axios'

class Search {
  static searchByKeyword = async (keyword, currentpage, limit) => {
    return await axios
      .get(
        `${process.env.NEXT_PUBLIC_ADMIN_API_URL}/search/search-by-keyword`,
        {
          params: {
            keyword: keyword,
            page: currentpage,
            limit: limit,
          },
        }
      )
      .then((response) => {
        return response
      })
      .catch((error) => {
        console.log(error)
        throw error.response.data
      })
  }
}

export default Search
