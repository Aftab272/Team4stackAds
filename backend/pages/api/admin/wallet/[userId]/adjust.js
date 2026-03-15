const { authenticateToken } = require('../../../../middleware/adminAuth')
const { adjustUserBalance } = require('../../../../controllers/walletController')

// POST /api/admin/wallet/:userId/adjust - Adjust user balance
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

    const { userId } = req.query

    if (req.method === 'POST') {
      await adjustUserBalance(req, res)
    } else {
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    console.error('Wallet adjustment API error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

export default handler
