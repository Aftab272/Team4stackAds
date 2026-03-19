const { getAds } = require('../../../controllers/adController')
const { authenticateToken } = require('../../../middleware/auth')
const { rateLimit } = require('../../../middleware/rateLimit')

const limiter = rateLimit({ windowMs: 60000, max: 60, keyPrefix: 'ads_list' })

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  return limiter(req, res, () =>
    authenticateToken(req, res, () => getAds(req, res))
  )
}
