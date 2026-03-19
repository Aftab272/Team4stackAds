const { updateAd, deleteAd } = require('../../../../controllers/adController')
const { authenticateToken, requireAdmin } = require('../../../../middleware/adminAuth')

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    return authenticateToken(req, res, () => requireAdmin(req, res, () => updateAd(req, res)))
  }

  if (req.method === 'DELETE') {
    return authenticateToken(req, res, () => requireAdmin(req, res, () => deleteAd(req, res)))
  }

  return res.status(405).json({ message: 'Method not allowed' })
}
