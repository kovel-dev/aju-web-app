import { getSession } from 'next-auth/client'
import jwt from 'next-auth/jwt'
import axios from 'axios'

async function handler(req, res) {
  if (req.method == 'GET') {
    const session = await getSession({ req: req })

    // validate if user is authenticated
    if (!session) {
      res.status(401).json([{ key: 'general', values: 'Not Authenticated' }])
      return
    }

    // get request token
    let payLoad = await jwt.getToken({
      req: req,
      secret: process.env.JWT_SECRET,
    })

    // encode token
    let apiToken = await jwt.encode({
      token: payLoad,
      secret: process.env.JWT_SECRET,
    })

    // call to the backend
    return await axios
      .post(
        `${process.env.NEXT_PUBLIC_ADMIN_API_URL}/users/get-user-by-ref`,
        {
          ref: payLoad.userRefID,
        },
        // apply token for BE authentication as user must be logged in to process this request
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
          },
        }
      )
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
