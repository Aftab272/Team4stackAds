const { getAllPayments } = require('../../../../controllers/paymentController')
const { authenticateToken, requireAdmin } = require('../../../../middleware/adminAuth')

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  return authenticateToken(req, res, () => requireAdmin(req, res, () => getAllPayments(req, res)))
}
