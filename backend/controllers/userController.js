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

// Admin: Get all users
const getAllUsers = async (req, res) => {
  try {
    const { search = '', status = 'active', page = 1, limit = 20 } = req.query
    const offset = (page - 1) * limit

    let query = supabase
      .from('users')
      .select('*', { count: 'exact' })
      .neq('role', 'admin') // Exclude admins from list
      .eq('status', status !== 'all' ? status : 'active')
      .or(`name.ilike.%${search}%,email.ilike.%${search}%`)
      .order('created_at', { ascending: false })
      .range(offset, offset + parseInt(limit) - 1)

    const { data: users, error, count } = await query

    if (error) {
      return res.status(500).json({ message: 'Error fetching users', error: error.message })
    }

    // Get wallet balances for each user
    const usersWithWallets = await Promise.all(
      users.map(async (user) => {
        const { data: wallet } = await supabase
          .from('wallet')
          .select('balance')
          .eq('user_id', user.id)
          .single()

        const { count: referralCount } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .eq('referred_by', user.id)

        return {
          ...user,
          walletBalance: wallet ? parseFloat(wallet.balance) : 0,
          referralCount: referralCount || 0,
        }
      })
    )

    res.json({
      users: usersWithWallets,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit)),
      },
    })
  } catch (error) {
    console.error('Get all users error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

// Admin: Get single user details
const getUserById = async (req, res) => {
  try {
    const { id } = req.params

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Get wallet
    const { data: wallet } = await supabase
      .from('wallet')
      .select('*')
      .eq('user_id', id)
      .single()

    // Get referrals
    const { data: referrals } = await supabase
      .from('users')
      .select('id, name, email, created_at')
      .eq('referred_by', id)

    res.json({
      user: {
        ...user,
        wallet: wallet || null,
        referrals: referrals || [],
      },
    })
  } catch (error) {
    console.error('Get user by ID error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

// Admin: Update user status (suspend/activate)
const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body
    const adminId = req.user.userId

    if (!['active', 'suspended'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' })
    }

    const { data, error } = await supabase
      .from('users')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return res.status(500).json({ message: 'Error updating user status', error: error.message })
    }

    // Log admin activity
    const { logAdminActivity } = require('./adminController')
    await logAdminActivity(adminId, 'UPDATE_USER_STATUS', 'users', id, { status })

    res.json({ message: `User ${status} successfully`, user: data })
  } catch (error) {
    console.error('Update user status error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

// Admin: Delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params
    const adminId = req.user.userId

    // Soft delete - update status to deleted
    const { error } = await supabase
      .from('users')
      .update({ status: 'deleted', updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) {
      return res.status(500).json({ message: 'Error deleting user', error: error.message })
    }

    // Log admin activity
    const { logAdminActivity } = require('./adminController')
    await logAdminActivity(adminId, 'DELETE_USER', 'users', id, {})

    res.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Delete user error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

module.exports = { getProfile, getAllUsers, getUserById, updateUserStatus, deleteUser }
