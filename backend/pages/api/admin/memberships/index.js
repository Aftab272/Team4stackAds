const { getAllMemberships, createMembership } = require('../../../../controllers/membershipController')
const { authenticateToken, requireAdmin } = require('../../../../middleware/adminAuth')

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return authenticateToken(req, res, () => requireAdmin(req, res, () => getAllMemberships(req, res)))
  }

  if (req.method === 'POST') {
    return authenticateToken(req, res, () => requireAdmin(req, res, () => createMembership(req, res)))
  }

  return res.status(405).json({ message: 'Method not allowed' })
}
