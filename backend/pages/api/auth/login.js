const { login } = require('../../../controllers/authController')
const { rateLimit } = require('../../../middleware/rateLimit')
const { verifyRecaptcha } = require('../../../middleware/recaptcha')

const limiter = rateLimit({ windowMs: 60000, max: 10, keyPrefix: 'auth_login' })

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  return limiter(req, res, () => verifyRecaptcha(req, res, () => login(req, res)))
}
