const { authenticateToken } = require('../../../../middleware/adminAuth')
const { approveWithdrawal, rejectWithdrawal } = require('../../../../controllers/withdrawController')

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

    const { id } = req.query

    if (req.method === 'POST') {
      const { action } = req.body
      
      if (action === 'approve') {
        await approveWithdrawal(req, res)
      } else if (action === 'reject') {
        await rejectWithdrawal(req, res)
      } else {
        return res.status(400).json({ message: 'Invalid action. Use "approve" or "reject"' })
      }
    } else {
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    console.error('Withdraw action API error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

export default handler
