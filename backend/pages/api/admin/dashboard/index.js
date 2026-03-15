const { authenticateToken, requireAdmin } = require('../../../middleware/adminAuth')
const { getDashboardStats } = require('../../../controllers/adminController')

// GET /api/admin/dashboard - Get dashboard statistics
const handler = async (req, res) => {
  try {
    // Authenticate and verify admin
    await new Promise((resolve, reject) => {
      authenticateToken(req, res, () => {
        if (req.user.role !== 'admin') {
          return res.status(403).json({ message: 'Admin access required' })
        }
        resolve()
      })
    })

    if (req.method === 'GET') {
      await getDashboardStats(req, res)
    } else {
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    console.error('Dashboard API error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

module.exports = handler
