const { authenticateToken } = require('../../../middleware/adminAuth')
const { getAllTasks, createTask } = require('../../../controllers/taskController')

// GET /api/admin/tasks - Get all tasks
// POST /api/admin/tasks - Create new task
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
      await getAllTasks(req, res)
    } else if (req.method === 'POST') {
      await createTask(req, res)
    } else {
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    console.error('Tasks API error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

export default handler
