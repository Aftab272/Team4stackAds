const { handleOfferwallCallback } = require('../../../../controllers/adController')

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  return handleOfferwallCallback(req, res)
}
