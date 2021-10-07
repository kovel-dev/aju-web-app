import axios from 'axios'

async function handler(req, res) {
  if (req.method == 'GET') {
    // call to the backend
    return await axios
      .get(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/pages/get-faq`)
      .then((result) => {
        let response = result.data

        res.status(200).json(response)
        return
      })
      .catch((error) => {
        res.status(422).json(error.response.data)
        return
      })
  }
}

export default handler
