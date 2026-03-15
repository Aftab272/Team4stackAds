const { authenticateToken } = require('../../../../middleware/adminAuth')
const { updateUserStatus, deleteUser } = require('../../../../controllers/userController')

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

    const { id } = req.query

    if (req.method === 'PUT') {
      await updateUserStatus(req, res)
    } else if (req.method === 'DELETE') {
      await deleteUser(req, res)
    } else {
      res.setHeader('Allow', ['PUT', 'DELETE'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    console.error('User operation API error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

export default handler
