const { getWalletData } = require('../../../controllers/walletController')
const { authenticateToken } = require('../../../middleware/auth')

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  return authenticateToken(req, res, () => getWalletData(req, res))
}
