const { authenticateToken } = require('../../../../middleware/adminAuth')
const { updateAnnouncement, deleteAnnouncement } = require('../../../../controllers/announcementController')

// PUT /api/admin/announcements/:id - Update announcement
// DELETE /api/admin/announcements/:id - Delete announcement
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

    const { id } = req.query

    if (req.method === 'PUT') {
      await updateAnnouncement(req, res)
    } else if (req.method === 'DELETE') {
      await deleteAnnouncement(req, res)
    } else {
      res.setHeader('Allow', ['PUT', 'DELETE'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    console.error('Announcement operation API error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

export default handler
