const { authenticateToken } = require('../../../../middleware/adminAuth')
const { updateTask, deleteTask } = require('../../../../controllers/taskController')

// PUT /api/admin/tasks/:id - Update task
// DELETE /api/admin/tasks/:id - Delete task
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
      await updateTask(req, res)
    } else if (req.method === 'DELETE') {
      await deleteTask(req, res)
    } else {
      res.setHeader('Allow', ['PUT', 'DELETE'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    console.error('Task operation API error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

export default handler
