const { getMemberships } = require('../../../controllers/membershipController')

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  return getMemberships(req, res)
}
