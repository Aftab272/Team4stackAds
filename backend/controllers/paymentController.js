const supabase = require('../database/supabase')
const { getActiveMembershipForUser } = require('./membershipController')

const createPaymentRequest = async (req, res) => {
  try {
    const userId = req.user.userId
    const { membershipId, gateway, transactionId, phoneNumber, proofData, proofFilename } = req.body

    if (!membershipId || !gateway) {
      return res.status(400).json({ message: 'Membership and gateway are required' })
    }

    const { data: membership, error: membershipError } = await supabase
      .from('memberships')
      .select('*')
      .eq('id', membershipId)
      .eq('is_active', true)
      .single()

    if (membershipError || !membership) {
      return res.status(404).json({ message: 'Membership not found' })
    }

    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        user_id: userId,
        membership_id: membership.id,
        amount: membership.price,
        currency: 'PKR',
        gateway,
        status: 'pending',
        reference: transactionId || null,
      })
      .select()
      .single()

    if (paymentError) {
      return res.status(500).json({ message: 'Error creating payment', error: paymentError.message })
    }

    if (transactionId || phoneNumber || proofData) {
      await supabase.from('payment_proofs').insert({
        payment_id: payment.id,
        transaction_id: transactionId || null,
        sender_phone: phoneNumber || null,
        proof_filename: proofFilename || null,
        proof_data: proofData || null,
      })
    }

    res.status(201).json({ message: 'Payment request created', payment })
  } catch (error) {
    console.error('Create payment error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

const getMyPayments = async (req, res) => {
  try {
    const userId = req.user.userId
    const { data: payments, error } = await supabase
      .from('payments')
      .select(`
        *,
        memberships (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      return res.status(500).json({ message: 'Error fetching payments', error: error.message })
    }

    res.json({ payments: payments || [] })
  } catch (error) {
    console.error('Get payments error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

const getAllPayments = async (req, res) => {
  try {
    const { status = 'all', page = 1, limit = 20 } = req.query
    const offset = (page - 1) * limit

    let query = supabase
      .from('payments')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + parseInt(limit) - 1)

    if (status !== 'all') {
      query = query.eq('status', status)
    }

    const { data: payments, error, count } = await query

    if (error) {
      return res.status(500).json({ message: 'Error fetching payments', error: error.message })
    }

    const paymentsWithUsers = await Promise.all(
      (payments || []).map(async (payment) => {
        const { data: user } = await supabase
          .from('users')
          .select('name, email')
          .eq('id', payment.user_id)
          .single()
        return {
          ...payment,
          userName: user?.name || 'Unknown',
          userEmail: user?.email || 'Unknown',
        }
      })
    )

    res.json({
      payments: paymentsWithUsers,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit)),
      },
    })
  } catch (error) {
    console.error('Get all payments error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

const approvePayment = async (req, res) => {
  try {
    const adminId = req.user.userId
    const { id } = req.params

    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('id', id)
      .single()

    if (paymentError || !payment) {
      return res.status(404).json({ message: 'Payment not found' })
    }

    if (payment.status !== 'pending') {
      return res.status(400).json({ message: 'Payment already processed' })
    }

    const { data: membership } = await supabase
      .from('memberships')
      .select('*')
      .eq('id', payment.membership_id)
      .single()

    if (!membership) {
      return res.status(400).json({ message: 'Membership not found' })
    }

    await supabase
      .from('payments')
      .update({ status: 'paid', updated_at: new Date().toISOString() })
      .eq('id', id)

    // Expire existing memberships
    await supabase
      .from('user_memberships')
      .update({ status: 'expired', updated_at: new Date().toISOString() })
      .eq('user_id', payment.user_id)
      .eq('status', 'active')

    const startedAt = new Date()
    const expiresAt = new Date(startedAt.getTime() + membership.duration_days * 24 * 60 * 60 * 1000)

    const { data: userMembership } = await supabase
      .from('user_memberships')
      .insert({
        user_id: payment.user_id,
        membership_id: membership.id,
        status: 'active',
        started_at: startedAt.toISOString(),
        expires_at: expiresAt.toISOString(),
        approved_at: new Date().toISOString(),
      })
      .select()
      .single()

    await supabase
      .from('users')
      .update({ membership_id: membership.id, updated_at: new Date().toISOString() })
      .eq('id', payment.user_id)

    const { logAdminActivity } = require('./adminController')
    await logAdminActivity(adminId, 'APPROVE_PAYMENT', 'payments', id, { membershipId: membership.id })

    res.json({ message: 'Payment approved and membership activated', userMembership })
  } catch (error) {
    console.error('Approve payment error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

const rejectPayment = async (req, res) => {
  try {
    const adminId = req.user.userId
    const { id } = req.params
    const { reason } = req.body

    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('id', id)
      .single()

    if (paymentError || !payment) {
      return res.status(404).json({ message: 'Payment not found' })
    }

    if (payment.status !== 'pending') {
      return res.status(400).json({ message: 'Payment already processed' })
    }

    await supabase
      .from('payments')
      .update({ status: 'failed', updated_at: new Date().toISOString() })
      .eq('id', id)

    const { logAdminActivity } = require('./adminController')
    await logAdminActivity(adminId, 'REJECT_PAYMENT', 'payments', id, { reason })

    res.json({ message: 'Payment rejected', reason })
  } catch (error) {
    console.error('Reject payment error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

const handleGatewayWebhook = async (req, res) => {
  try {
    const { gateway } = req.query
    const payload = req.body || {}
    const providedSecret = req.headers['x-webhook-secret']

    const expectedSecret = process.env.WEBHOOK_SHARED_SECRET
    if (expectedSecret && providedSecret !== expectedSecret) {
      return res.status(401).json({ message: 'Invalid signature' })
    }

    const reference = payload.reference || payload.pp_TxnRefNo || payload.transaction_id
    const status = payload.status || payload.ResponseCode || payload.state

    if (!reference) {
      return res.status(400).json({ message: 'Reference missing' })
    }

    const { data: payment } = await supabase
      .from('payments')
      .select('*')
      .eq('reference', reference)
      .single()

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' })
    }

    if (String(status) === '000' || String(status).toLowerCase() === 'paid' || String(status).toLowerCase() === 'success') {
      await supabase
        .from('payments')
        .update({ status: 'paid', updated_at: new Date().toISOString(), gateway })
        .eq('id', payment.id)
      return res.json({ message: 'Payment marked paid' })
    }

    await supabase
      .from('payments')
      .update({ status: 'failed', updated_at: new Date().toISOString(), gateway })
      .eq('id', payment.id)

    res.json({ message: 'Payment marked failed' })
  } catch (error) {
    console.error('Webhook error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

module.exports = {
  createPaymentRequest,
  getMyPayments,
  getAllPayments,
  approvePayment,
  rejectPayment,
  handleGatewayWebhook,
}
