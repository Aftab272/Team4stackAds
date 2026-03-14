const { createWithdrawRequest, getWithdrawals } = require('../../../controllers/withdrawController')
const { authenticateToken } = require('../../../middleware/auth')

export default async function handler(req, res) {
  authenticateToken(req, res, async () => {
    if (req.method === 'POST') {
      return createWithdrawRequest(req, res)
    } else if (req.method === 'GET') {
      return getWithdrawals(req, res)
    } else {
      return res.status(405).json({ message: 'Method not allowed' })
    }
  })
}
