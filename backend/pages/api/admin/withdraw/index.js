const { authenticateToken } = require('../../../middleware/adminAuth')
const { getAllWithdrawRequests, approveWithdrawal, rejectWithdrawal } = require('../../../controllers/withdrawController')

// GET /api/admin/withdraw - Get all withdrawal requests
// POST /api/admin/withdraw/:id/approve - Approve withdrawal
// POST /api/admin/withdraw/:id/reject - Reject withdrawal
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
      await getAllWithdrawRequests(req, res)
    } else {
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    console.error('Withdraw requests API error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

export default handler
