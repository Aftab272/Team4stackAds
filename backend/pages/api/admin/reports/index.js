const { authenticateToken } = require('../../../middleware/adminAuth')
const supabase = require('../../../database/supabase')

// GET /api/admin/reports - Get analytics and reports data
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

    if (req.method !== 'GET') {
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
      return
    }

    const { type = 'overview', startDate, endDate } = req.query

    let reportData = {}

    if (type === 'overview' || type === 'user-growth') {
      // User registration growth
      const dateFilter = startDate && endDate 
        ? { gte: startDate, lte: endDate }
        : { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() }

      const { data: userRegistrations } = await supabase
        .from('users')
        .select('created_at')
        .gte('created_at', dateFilter.gte)
        .lte('created_at', dateFilter.lte || new Date().toISOString())
        .order('created_at', { ascending: true })

      // Group by date
      const userGrowth = {}
      userRegistrations?.forEach(user => {
        const date = new Date(user.created_at).toLocaleDateString()
        userGrowth[date] = (userGrowth[date] || 0) + 1
      })

      reportData.userGrowth = userGrowth
    }

    if (type === 'overview' || type === 'task-statistics') {
      // Task completion statistics
      const { count: totalTasks } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })

      const { count: completedTasks } = await supabase
        .from('user_tasks')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed')

      reportData.taskStatistics = {
        totalTasks: totalTasks || 0,
        completedTasks: completedTasks || 0,
        completionRate: totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(2) : 0,
      }
    }

    if (type === 'overview' || type === 'withdraw-trends') {
      // Withdraw trends
      const { data: withdrawData } = await supabase
        .from('withdraw_requests')
        .select('amount, status, created_at')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: true })

      const withdrawTrends = {
        total: withdrawData?.length || 0,
        approved: withdrawData?.filter(w => w.status === 'approved').length || 0,
        pending: withdrawData?.filter(w => w.status === 'pending').length || 0,
        rejected: withdrawData?.filter(w => w.status === 'rejected').length || 0,
        totalAmount: withdrawData?.reduce((sum, w) => sum + parseFloat(w.amount), 0) || 0,
      }

      reportData.withdrawTrends = withdrawTrends
    }

    if (type === 'overview' || type === 'revenue') {
      // Revenue analytics
      const { data: wallets } = await supabase
        .from('wallet')
        .select('balance, total_earned')

      const totalBalance = wallets?.reduce((sum, w) => sum + parseFloat(w.balance), 0) || 0
      const totalEarned = wallets?.reduce((sum, w) => sum + parseFloat(w.total_earned), 0) || 0

      const { count: totalUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')

      reportData.revenue = {
        totalBalance,
        totalEarned,
        activeUsers: totalUsers || 0,
        averagePerUser: totalUsers > 0 ? (totalEarned / totalUsers).toFixed(2) : 0,
      }
    }

    res.json({ report: reportData })
  } catch (error) {
    console.error('Reports API error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

export default handler
