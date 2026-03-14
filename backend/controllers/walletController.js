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

module.exports = { getWalletData }
