const { authenticateToken } = require('../../../middleware/adminAuth')
const { getAllWalletTransactions, getWalletStatistics } = require('../../../controllers/walletController')

// GET /api/admin/wallet - Get all wallet transactions and statistics
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
      const { action } = req.query
      
      if (action === 'statistics') {
        await getWalletStatistics(req, res)
      } else {
        await getAllWalletTransactions(req, res)
      }
    } else {
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    console.error('Wallet API error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

export default handler
