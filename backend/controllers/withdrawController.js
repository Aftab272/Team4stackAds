const supabase = require('../database/supabase')
const { getActiveMembershipForUser } = require('./membershipController')

const parseNumber = (value, fallback = 0) => {
  const num = parseFloat(value)
  return Number.isNaN(num) ? fallback : num
}

const createWithdrawRequest = async (req, res) => {
  try {
    const userId = req.user.userId
    const { amount, paymentMethod, accountDetails } = req.body

    if (!amount || !paymentMethod || !accountDetails) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    const numericAmount = parseNumber(amount, 0)
    if (numericAmount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' })
    }

    const activeMembership = await getActiveMembershipForUser(userId)
    const minWithdrawDefault = parseNumber(process.env.MIN_WITHDRAW_DEFAULT, 200)
    const minWithdraw = activeMembership?.memberships?.min_withdraw || minWithdrawDefault
    if (numericAmount < minWithdraw) {
      return res.status(400).json({ message: `Minimum withdrawal is ${minWithdraw}` })
    }

    const dailyLimit = parseNumber(process.env.WITHDRAW_DAILY_LIMIT, 0)
    if (dailyLimit > 0 && numericAmount > dailyLimit) {
      return res.status(400).json({ message: `Daily withdrawal limit is ${dailyLimit}` })
    }

    const dailyCountLimit = parseInt(process.env.WITHDRAW_DAILY_COUNT_LIMIT || '0', 10)
    if (dailyCountLimit > 0) {
      const startOfDay = new Date()
      startOfDay.setHours(0, 0, 0, 0)
      const { count: todayCount } = await supabase
        .from('withdraw_requests')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('created_at', startOfDay.toISOString())

      if (todayCount >= dailyCountLimit) {
        return res.status(400).json({ message: 'Daily withdrawal request limit reached' })
      }
    }

    // Check wallet balance
    const { data: wallet, error: walletError } = await supabase
      .from('wallet')
      .select('balance')
      .eq('user_id', userId)
      .single()

    if (walletError || !wallet) {
      return res.status(404).json({ message: 'Wallet not found' })
    }

    if (numericAmount > parseFloat(wallet.balance)) {
      return res.status(400).json({ message: 'Insufficient balance' })
    }

    const feePercent = parseNumber(process.env.WITHDRAW_FEE_PERCENT, 0)
    const feeAmount = feePercent > 0 ? (numericAmount * feePercent) / 100 : 0
    const totalDebit = numericAmount + feeAmount

    if (totalDebit > parseFloat(wallet.balance)) {
      return res.status(400).json({ message: 'Insufficient balance for withdrawal fee' })
    }

    // Create withdraw request
    const { data: withdrawRequest, error: withdrawError } = await supabase
      .from('withdraw_requests')
      .insert({
        user_id: userId,
        amount: numericAmount,
        fee_amount: feeAmount,
        payment_method: paymentMethod,
        account_details: accountDetails,
        status: 'pending',
      })
      .select()
      .single()

    if (withdrawError) {
      return res.status(500).json({ message: 'Error creating withdraw request', error: withdrawError.message })
    }

    res.status(201).json({
      message: 'Withdrawal request submitted successfully',
      withdrawRequest,
      feeAmount,
    })
  } catch (error) {
    console.error('Create withdraw request error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

const getWithdrawals = async (req, res) => {
  try {
    const userId = req.user.userId

    const { data: withdrawals, error } = await supabase
      .from('withdraw_requests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      return res.status(500).json({ message: 'Error fetching withdrawals', error: error.message })
    }

    res.json({ withdrawals: withdrawals || [] })
  } catch (error) {
    console.error('Get withdrawals error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

// Admin: Get all withdrawal requests
const getAllWithdrawRequests = async (req, res) => {
  try {
    const { status = 'all', page = 1, limit = 20 } = req.query
    const offset = (page - 1) * limit

    let query = supabase
      .from('withdraw_requests')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + parseInt(limit) - 1)

    if (status !== 'all') {
      query = query.eq('status', status)
    }

    const { data: requests, error, count } = await query

    if (error) {
      return res.status(500).json({ message: 'Error fetching withdrawal requests', error: error.message })
    }

    // Get user details for each request
    const requestsWithUsers = await Promise.all(
      requests.map(async (request) => {
        const { data: user } = await supabase
          .from('users')
          .select('name, email')
          .eq('id', request.user_id)
          .single()

        return {
          ...request,
          userName: user?.name || 'Unknown',
          userEmail: user?.email || 'Unknown',
        }
      })
    )

    res.json({
      requests: requestsWithUsers,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit)),
      },
    })
  } catch (error) {
    console.error('Get all withdraw requests error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

// Admin: Approve withdrawal
const approveWithdrawal = async (req, res) => {
  try {
    const { id } = req.params
    const adminId = req.user.userId

    // Get withdraw request
    const { data: request, error: fetchError } = await supabase
      .from('withdraw_requests')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !request) {
      return res.status(404).json({ message: 'Withdrawal request not found' })
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request already processed' })
    }

    // Update request status
    const { error: updateError } = await supabase
      .from('withdraw_requests')
      .update({ 
        status: 'approved',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (updateError) {
      return res.status(500).json({ message: 'Error approving withdrawal', error: updateError.message })
    }

    // Deduct from wallet
    const { data: wallet } = await supabase
      .from('wallet')
      .select('*')
      .eq('user_id', request.user_id)
      .single()

    if (wallet) {
      const feeAmount = parseFloat(request.fee_amount || 0)
      const totalDebit = parseFloat(request.amount) + feeAmount
      const newBalance = parseFloat(wallet.balance) - totalDebit
      
      await supabase
        .from('wallet')
        .update({
          balance: newBalance,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', request.user_id)

      // Record transaction
      await supabase.from('wallet_transactions').insert({
        wallet_id: wallet.id,
        type: 'debit',
        amount: totalDebit,
        description: `Withdrawal approved: ${request.payment_method}${feeAmount ? ` (fee ${feeAmount})` : ''}`,
        balance_after: newBalance,
      })
    }

    // Log admin activity
    const { logAdminActivity } = require('./adminController')
    await logAdminActivity(adminId, 'APPROVE_WITHDRAWAL', 'withdraw_requests', id, { amount: request.amount })

    res.json({ message: 'Withdrawal approved successfully' })
  } catch (error) {
    console.error('Approve withdrawal error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

// Admin: Reject withdrawal
const rejectWithdrawal = async (req, res) => {
  try {
    const { id } = req.params
    const { reason } = req.body
    const adminId = req.user.userId

    // Get withdraw request
    const { data: request, error: fetchError } = await supabase
      .from('withdraw_requests')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !request) {
      return res.status(404).json({ message: 'Withdrawal request not found' })
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request already processed' })
    }

    // Update request status
    const { error: updateError } = await supabase
      .from('withdraw_requests')
      .update({ 
        status: 'rejected',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (updateError) {
      return res.status(500).json({ message: 'Error rejecting withdrawal', error: updateError.message })
    }

    // Log admin activity
    const { logAdminActivity } = require('./adminController')
    await logAdminActivity(adminId, 'REJECT_WITHDRAWAL', 'withdraw_requests', id, { reason })

    res.json({ message: 'Withdrawal rejected', reason })
  } catch (error) {
    console.error('Reject withdrawal error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

module.exports = { 
  createWithdrawRequest, 
  getWithdrawals,
  getAllWithdrawRequests,
  approveWithdrawal,
  rejectWithdrawal
}
