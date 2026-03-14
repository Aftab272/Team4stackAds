const supabase = require('../database/supabase')

const createWithdrawRequest = async (req, res) => {
  try {
    const userId = req.user.userId
    const { amount, paymentMethod, accountDetails } = req.body

    if (!amount || !paymentMethod || !accountDetails) {
      return res.status(400).json({ message: 'All fields are required' })
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

    if (parseFloat(amount) > parseFloat(wallet.balance)) {
      return res.status(400).json({ message: 'Insufficient balance' })
    }

    // Create withdraw request
    const { data: withdrawRequest, error: withdrawError } = await supabase
      .from('withdraw_requests')
      .insert({
        user_id: userId,
        amount: parseFloat(amount),
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

module.exports = { createWithdrawRequest, getWithdrawals }
