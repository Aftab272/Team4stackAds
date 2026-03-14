const supabase = require('../database/supabase')

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    // Total users count
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')

    // Active users (logged in last 7 days)
    const { count: activeUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')
      .gte('updated_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

    // Total earnings (sum of all wallets)
    const { data: walletData } = await supabase
      .from('wallet')
      .select('balance, total_earned')

    const totalEarnings = walletData?.reduce((sum, w) => sum + parseFloat(w.total_earned), 0) || 0

    // Pending withdrawals
    const { count: pendingWithdrawals } = await supabase
      .from('withdraw_requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')

    // Completed withdrawals
    const { count: completedWithdrawals } = await supabase
      .from('withdraw_requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved')

    // Total tasks
    const { count: totalTasks } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')

    // Recent activity (last 10 transactions)
    const { data: recentActivity } = await supabase
      .from('wallet_transactions')
      .select(`
        *,
        wallet:user_id (
          user_id,
          users:name
        )
      `)
      .order('created_at', { ascending: false })
      .limit(10)

    // User growth (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const { data: userGrowthData } = await supabase
      .from('users')
      .select('created_at')
      .gte('created_at', thirtyDaysAgo)
      .order('created_at', { ascending: true })

    // Group by date
    const userGrowth = {}
    userGrowthData?.forEach(user => {
      const date = new Date(user.created_at).toLocaleDateString()
      userGrowth[date] = (userGrowth[date] || 0) + 1
    })

    res.json({
      stats: {
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        totalEarnings: totalEarnings,
        pendingWithdrawals: pendingWithdrawals || 0,
        completedWithdrawals: completedWithdrawals || 0,
        totalTasks: totalTasks || 0,
      },
      recentActivity: recentActivity || [],
      userGrowth: userGrowth || {},
    })
  } catch (error) {
    console.error('Get dashboard stats error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

// Log admin activity
const logAdminActivity = async (adminId, action, entityType, entityId, details, ipAddress) => {
  try {
    await supabase.from('admin_activity_logs').insert({
      admin_id: adminId,
      action,
      entity_type: entityType,
      entity_id: entityId,
      details: details || {},
      ip_address: ipAddress,
    })
  } catch (error) {
    console.error('Log admin activity error:', error)
  }
}

module.exports = { getDashboardStats, logAdminActivity }
