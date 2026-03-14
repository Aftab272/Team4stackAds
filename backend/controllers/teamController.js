const supabase = require('../database/supabase')

const getTeamData = async (req, res) => {
  try {
    const userId = req.user.userId

    // Get referrals
    const { data: referrals, error: referralsError } = await supabase
      .from('team_referrals')
      .select(`
        *,
        referred:users!team_referrals_referred_id_fkey(id, name, email, created_at)
      `)
      .eq('referrer_id', userId)

    if (referralsError) {
      return res.status(500).json({ message: 'Error fetching referrals', error: referralsError.message })
    }

    // Calculate totals
    const totalReferrals = referrals?.length || 0
    const activeReferrals = referrals?.filter(r => r.is_active).length || 0
    const totalEarnings = referrals?.reduce((sum, r) => sum + parseFloat(r.earnings || 0), 0) || 0

    // Format referrals data
    const formattedReferrals = (referrals || []).map(ref => ({
      id: ref.referred?.id,
      name: ref.referred?.name,
      email: ref.referred?.email,
      created_at: ref.referred?.created_at,
      is_active: ref.is_active,
      earnings: ref.earnings,
    }))

    res.json({
      totalReferrals,
      activeReferrals,
      totalEarnings,
      referrals: formattedReferrals,
    })
  } catch (error) {
    console.error('Get team data error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

module.exports = { getTeamData }
