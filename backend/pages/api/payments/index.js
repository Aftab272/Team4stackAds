const { createPaymentRequest, getMyPayments } = require('../../../controllers/paymentController')
const { authenticateToken } = require('../../../middleware/auth')
const { rateLimit } = require('../../../middleware/rateLimit')

const limiter = rateLimit({ windowMs: 60000, max: 20, keyPrefix: 'payments' })

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return authenticateToken(req, res, () => getMyPayments(req, res))
  }

  if (req.method === 'POST') {
    return limiter(req, res, () =>
      authenticateToken(req, res, () => createPaymentRequest(req, res))
    )
  }

  return res.status(405).json({ message: 'Method not allowed' })
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb',
    },
  },
}
