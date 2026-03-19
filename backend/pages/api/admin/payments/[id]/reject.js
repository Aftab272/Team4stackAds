const { rejectPayment } = require('../../../../../controllers/paymentController')
const { authenticateToken, requireAdmin } = require('../../../../../middleware/adminAuth')

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  return authenticateToken(req, res, () => requireAdmin(req, res, () => rejectPayment(req, res)))
}
