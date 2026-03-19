const supabase = require('../database/supabase')

const getActiveMembershipForUser = async (userId) => {
  const nowIso = new Date().toISOString()

  const { data: activeMembership, error } = await supabase
    .from('user_memberships')
    .select(`
      *,
      memberships (*)
    `)
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error || !activeMembership) {
    return null
  }

  if (activeMembership.expires_at && new Date(activeMembership.expires_at) < new Date()) {
    await supabase
      .from('user_memberships')
      .update({ status: 'expired', updated_at: nowIso })
      .eq('id', activeMembership.id)
    return null
  }

  return activeMembership
}

const getMemberships = async (req, res) => {
  try {
    const { data: memberships, error } = await supabase
      .from('memberships')
      .select('*')
      .eq('is_active', true)
      .order('price', { ascending: true })

    if (error) {
      return res.status(500).json({ message: 'Error fetching memberships', error: error.message })
    }

    res.json({ memberships: memberships || [] })
  } catch (error) {
    console.error('Get memberships error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

const getMyMembership = async (req, res) => {
  try {
    const userId = req.user.userId
    const activeMembership = await getActiveMembershipForUser(userId)

    if (!activeMembership) {
      return res.json({ membership: null })
    }

    res.json({ membership: activeMembership })
  } catch (error) {
    console.error('Get my membership error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

// Admin: get all memberships
const getAllMemberships = async (req, res) => {
  try {
    const { data: memberships, error } = await supabase
      .from('memberships')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return res.status(500).json({ message: 'Error fetching memberships', error: error.message })
    }

    res.json({ memberships: memberships || [] })
  } catch (error) {
    console.error('Get all memberships error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

// Admin: create membership
const createMembership = async (req, res) => {
  try {
    const adminId = req.user.userId
    const { name, price, adsPerDay, earnPerAd, durationDays, minWithdraw, isActive } = req.body

    if (!name || !price) {
      return res.status(400).json({ message: 'Name and price are required' })
    }

    const { data: membership, error } = await supabase
      .from('memberships')
      .insert({
        name,
        price: parseFloat(price),
        ads_per_day: parseInt(adsPerDay || 0, 10),
        earn_per_ad: parseFloat(earnPerAd || 0),
        duration_days: parseInt(durationDays || 30, 10),
        min_withdraw: parseFloat(minWithdraw || 200),
        is_active: isActive !== false,
      })
      .select()
      .single()

    if (error) {
      return res.status(500).json({ message: 'Error creating membership', error: error.message })
    }

    const { logAdminActivity } = require('./adminController')
    await logAdminActivity(adminId, 'CREATE_MEMBERSHIP', 'memberships', membership.id, { name, price })

    res.status(201).json({ message: 'Membership created', membership })
  } catch (error) {
    console.error('Create membership error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

// Admin: update membership
const updateMembership = async (req, res) => {
  try {
    const adminId = req.user.userId
    const { id } = req.params
    const { name, price, adsPerDay, earnPerAd, durationDays, minWithdraw, isActive } = req.body

    const updateData = {}
    if (name) updateData.name = name
    if (price !== undefined) updateData.price = parseFloat(price)
    if (adsPerDay !== undefined) updateData.ads_per_day = parseInt(adsPerDay, 10)
    if (earnPerAd !== undefined) updateData.earn_per_ad = parseFloat(earnPerAd)
    if (durationDays !== undefined) updateData.duration_days = parseInt(durationDays, 10)
    if (minWithdraw !== undefined) updateData.min_withdraw = parseFloat(minWithdraw)
    if (isActive !== undefined) updateData.is_active = isActive
    updateData.updated_at = new Date().toISOString()

    const { data: membership, error } = await supabase
      .from('memberships')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return res.status(500).json({ message: 'Error updating membership', error: error.message })
    }

    const { logAdminActivity } = require('./adminController')
    await logAdminActivity(adminId, 'UPDATE_MEMBERSHIP', 'memberships', id, updateData)

    res.json({ message: 'Membership updated', membership })
  } catch (error) {
    console.error('Update membership error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

// Admin: delete membership
const deleteMembership = async (req, res) => {
  try {
    const adminId = req.user.userId
    const { id } = req.params

    const { error } = await supabase
      .from('memberships')
      .delete()
      .eq('id', id)

    if (error) {
      return res.status(500).json({ message: 'Error deleting membership', error: error.message })
    }

    const { logAdminActivity } = require('./adminController')
    await logAdminActivity(adminId, 'DELETE_MEMBERSHIP', 'memberships', id, {})

    res.json({ message: 'Membership deleted' })
  } catch (error) {
    console.error('Delete membership error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

module.exports = {
  getMemberships,
  getMyMembership,
  getAllMemberships,
  createMembership,
  updateMembership,
  deleteMembership,
  getActiveMembershipForUser,
}
