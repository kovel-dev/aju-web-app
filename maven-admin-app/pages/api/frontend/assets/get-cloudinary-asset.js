import Cors from 'cors'
import corsMiddleware from '../../../../lib/middleware/cors'

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
    const data = req.body
    const { publicId } = data
    let cloudinary = require('cloudinary').v2
    let asset = await cloudinary.api.resource(
      publicId,
      function (error, result) {
        return result
      }
    )
    return res.status(200).json(asset)
  } else {
    return res.status(405).json('Invalid Request')
  }
}

export default handler
