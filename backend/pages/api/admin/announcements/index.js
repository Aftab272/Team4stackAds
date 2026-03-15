const { authenticateToken } = require('../../../middleware/adminAuth')
const { getAllAnnouncements, createAnnouncement } = require('../../../controllers/announcementController')

// GET /api/admin/announcements - Get all announcements
// POST /api/admin/announcements - Create new announcement
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
      await getAllAnnouncements(req, res)
    } else if (req.method === 'POST') {
      await createAnnouncement(req, res)
    } else {
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    console.error('Announcements API error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

export default handler
