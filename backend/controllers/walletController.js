const supabase = require('../database/supabase')

const getWalletData = async (req, res) => {
  try {
    const userId = req.user.userId

    // Get wallet
    const { data: wallet, error: walletError } = await supabase
      .from('wallet')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (walletError || !wallet) {
      return res.status(404).json({ message: 'Wallet not found' })
    }

    // Get transactions
    const { data: transactions, error: transactionsError } = await supabase
      .from('wallet_transactions')
      .select('*')
      .eq('wallet_id', wallet.id)
      .order('created_at', { ascending: false })
      .limit(50)

    if (transactionsError) {
      return res.status(500).json({ message: 'Error fetching transactions', error: transactionsError.message })
    }

    res.json({
      balance: parseFloat(wallet.balance),
      totalEarned: parseFloat(wallet.total_earned),
      transactions: transactions || [],
    })
  } catch (error) {
    console.error('Get wallet data error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

// Admin: Get all wallet transactions
const getAllWalletTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 50, type = 'all', search = '' } = req.query
    const offset = (page - 1) * limit

    let query = supabase
      .from('wallet_transactions')
      .select(`
        *,
        wallet:user_id (
          user_id,
          users:name,
          users:email
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + parseInt(limit) - 1)

    if (type !== 'all') {
      query = query.eq('type', type)
    }

    const { data: transactions, error, count } = await query

    if (error) {
      return res.status(500).json({ message: 'Error fetching transactions', error: error.message })
    }

    // Format transactions with user info
    const formattedTransactions = transactions.map(tx => ({
      ...tx,
      userName: tx.wallet?.users?.name || 'Unknown',
      userEmail: tx.wallet?.users?.email || 'Unknown',
      userId: tx.wallet?.user_id || null,
    }))

    res.json({
      transactions: formattedTransactions,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit)),
      },
    })
  } catch (error) {
    console.error('Get all wallet transactions error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

// Admin: Adjust user balance (add bonus or deduct penalty)
const adjustUserBalance = async (req, res) => {
  try {
    const { userId } = req.params
    const { amount, type, description } = req.body
    const adminId = req.user.userId

    if (!amount || !type || !description) {
      return res.status(400).json({ message: 'Amount, type, and description are required' })
    }

    if (!['credit', 'debit'].includes(type)) {
      return res.status(400).json({ message: 'Invalid transaction type' })
    }

    const numericAmount = parseFloat(amount)
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' })
    }

    // Get user's wallet
    const { data: wallet, error: walletError } = await supabase
      .from('wallet')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (walletError || !wallet) {
      return res.status(404).json({ message: 'Wallet not found' })
    }

    // Calculate new balance
    let newBalance
    if (type === 'credit') {
      newBalance = parseFloat(wallet.balance) + numericAmount
    } else {
      newBalance = parseFloat(wallet.balance) - numericAmount
      if (newBalance < 0) {
        return res.status(400).json({ message: 'Insufficient balance for debit' })
      }
    }

    // Update wallet
    const { error: updateError } = await supabase
      .from('wallet')
      .update({
        balance: newBalance,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)

    if (updateError) {
      return res.status(500).json({ message: 'Error updating wallet', error: updateError.message })
    }

    // Record transaction
    const { data: transaction } = await supabase.from('wallet_transactions').insert({
      wallet_id: wallet.id,
      type,
      amount: numericAmount,
      description: `${description} (Admin: ${adminId})`,
      balance_after: newBalance,
    }).select().single()

    // Log admin activity
    const { logAdminActivity } = require('./adminController')
    await logAdminActivity(adminId, 'ADJUST_BALANCE', 'wallet', wallet.id, {
      type,
      amount: numericAmount,
      description,
    })

    res.json({
      message: `Balance ${type}ed successfully`,
      newBalance,
      transaction,
    })
  } catch (error) {
    console.error('Adjust user balance error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

// Admin: Get wallet statistics
const getWalletStatistics = async (req, res) => {
  try {
    // Total balance across all wallets
    const { data: allWallets } = await supabase
      .from('wallet')
      .select('balance, total_earned')

    const totalBalance = allWallets?.reduce((sum, w) => sum + parseFloat(w.balance), 0) || 0
    const totalEarned = allWallets?.reduce((sum, w) => sum + parseFloat(w.total_earned), 0) || 0

    // Transaction statistics
    const { count: totalTransactions } = await supabase
      .from('wallet_transactions')
      .select('*', { count: 'exact', head: true })

    const { count: creditCount } = await supabase
      .from('wallet_transactions')
      .select('*', { count: 'exact', head: true })
      .eq('type', 'credit')

    const { count: debitCount } = await supabase
      .from('wallet_transactions')
      .select('*', { count: 'exact', head: true })
      .eq('type', 'debit')

    res.json({
      statistics: {
        totalBalance,
        totalEarned,
        totalTransactions: totalTransactions || 0,
        creditTransactions: creditCount || 0,
        debitTransactions: debitCount || 0,
      },
    })
  } catch (error) {
    console.error('Get wallet statistics error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

module.exports = { 
  getWalletData,
  getAllWalletTransactions,
  adjustUserBalance,
  getWalletStatistics
}
