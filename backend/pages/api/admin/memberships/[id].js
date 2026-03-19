const { updateMembership, deleteMembership } = require('../../../../controllers/membershipController')
const { authenticateToken, requireAdmin } = require('../../../../middleware/adminAuth')

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    return authenticateToken(req, res, () => requireAdmin(req, res, () => updateMembership(req, res)))
  }

  if (req.method === 'DELETE') {
    return authenticateToken(req, res, () => requireAdmin(req, res, () => deleteMembership(req, res)))
  }

  return res.status(405).json({ message: 'Method not allowed' })
}
