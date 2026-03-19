const { completeAd } = require('../../../../controllers/adController')
const { authenticateToken } = require('../../../../middleware/auth')
const { rateLimit } = require('../../../../middleware/rateLimit')

const limiter = rateLimit({ windowMs: 60000, max: 30, keyPrefix: 'ads_complete' })

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  return limiter(req, res, () =>
    authenticateToken(req, res, () => completeAd(req, res))
  )
}
