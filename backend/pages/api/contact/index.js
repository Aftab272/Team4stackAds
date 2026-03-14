const { submitContact } = require('../../../controllers/contactController')
const { authenticateToken } = require('../../../middleware/auth')

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  return authenticateToken(req, res, () => submitContact(req, res))
}
