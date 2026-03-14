const supabase = require('../database/supabase')

const getSalaryData = async (req, res) => {
  try {
    const userId = req.user.userId

    // Get all earnings
    const { data: earnings, error: earningsError } = await supabase
      .from('earnings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (earningsError) {
      return res.status(500).json({ message: 'Error fetching earnings', error: earningsError.message })
    }

    // Calculate totals
    const totalEarnings = (earnings || []).reduce((sum, e) => sum + parseFloat(e.amount || 0), 0)

    // Calculate this month's earnings
    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const thisMonthEarnings = (earnings || [])
      .filter(e => new Date(e.created_at) >= firstDayOfMonth)
      .reduce((sum, e) => sum + parseFloat(e.amount || 0), 0)

    // Calculate team bonus (referral earnings)
    const teamBonus = (earnings || [])
      .filter(e => e.type === 'referral')
      .reduce((sum, e) => sum + parseFloat(e.amount || 0), 0)

    res.json({
      totalEarnings,
      thisMonth: thisMonthEarnings,
      teamBonus,
      earnings: earnings || [],
    })
  } catch (error) {
    console.error('Get salary data error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

module.exports = { getSalaryData }
