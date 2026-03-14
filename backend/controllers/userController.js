const supabase = require('../database/supabase')

const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId

    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, referral_code, created_at')
      .eq('id', userId)
      .single()

    if (error || !user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({ user })
  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

module.exports = { getProfile }
