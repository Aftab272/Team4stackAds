const { completeTask } = require('../../../controllers/taskController')
const { authenticateToken } = require('../../../middleware/auth')

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  req.params = { taskId: req.query.taskId }
  return authenticateToken(req, res, () => completeTask(req, res))
}
