const { getAllAds, createAd } = require('../../../../controllers/adController')
const { authenticateToken, requireAdmin } = require('../../../../middleware/adminAuth')

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return authenticateToken(req, res, () => requireAdmin(req, res, () => getAllAds(req, res)))
  }

  if (req.method === 'POST') {
    return authenticateToken(req, res, () => requireAdmin(req, res, () => createAd(req, res)))
  }

  return res.status(405).json({ message: 'Method not allowed' })
}
