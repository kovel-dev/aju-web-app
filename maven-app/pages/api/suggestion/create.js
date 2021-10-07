import axios from 'axios'

async function handler(req, res) {
  if (req.method == 'POST') {
    // parse needed values
    const data = req.body
    const { name, contact_email, phone, prefer_phone, type, details } = data

    // call to the backend
    return await axios
      .post(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/suggestion/create`, {
        name: name,
        contact_email: contact_email,
        phone: phone,
        prefer_phone: prefer_phone,
        type: type,
        details: details,
      })
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
