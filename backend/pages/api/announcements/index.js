const { getAnnouncements } = require('../../../controllers/announcementController')
const { authenticateToken } = require('../../../middleware/auth')

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  return authenticateToken(req, res, () => getAnnouncements(req, res))
}
