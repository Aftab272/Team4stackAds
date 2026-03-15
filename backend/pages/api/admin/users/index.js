const { authenticateToken } = require('../../../middleware/adminAuth')
const { getAllUsers, getUserById, updateUserStatus, deleteUser } = require('../../../controllers/userController')

// GET /api/admin/users - Get all users with pagination
// PUT /api/admin/users/:id/status - Update user status
// DELETE /api/admin/users/:id - Delete user
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
      await getAllUsers(req, res)
    } else {
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    console.error('Users API error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

export default handler
