const supabase = require('../database/supabase')
const { getActiveMembershipForUser } = require('./membershipController')

const getStartOfDayIso = () => {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
  return start.toISOString()
}

const getAds = async (req, res) => {
  try {
    const userId = req.user.userId
    const activeMembership = await getActiveMembershipForUser(userId)

    if (!activeMembership || !activeMembership.memberships) {
      return res.json({ ads: [], remainingToday: 0, membership: null })
    }

    const startOfDay = getStartOfDayIso()

    const { data: completedAds } = await supabase
      .from('user_ads')
      .select('ad_id')
      .eq('user_id', userId)
      .gte('created_at', startOfDay)

    const completedSet = new Set((completedAds || []).map((ad) => ad.ad_id))
    const { data: ads, error } = await supabase
      .from('ads')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      return res.status(500).json({ message: 'Error fetching ads', error: error.message })
    }

    const adsPerDay = activeMembership.memberships.ads_per_day || 0
    const completedCount = completedSet.size
    const remainingToday = Math.max(adsPerDay - completedCount, 0)

    const adsWithStatus = (ads || []).map((ad) => ({
      ...ad,
      status: completedSet.has(ad.id) ? 'completed' : 'available',
    }))

    res.json({
      ads: adsWithStatus,
      remainingToday,
      membership: activeMembership.memberships,
    })
  } catch (error) {
    console.error('Get ads error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

const completeAd = async (req, res) => {
  try {
    const userId = req.user.userId
    const { adId } = req.params

    const activeMembership = await getActiveMembershipForUser(userId)
    if (!activeMembership || !activeMembership.memberships) {
      return res.status(403).json({ message: 'Active membership required' })
    }

    const startOfDay = getStartOfDayIso()
    const { count: completedCount } = await supabase
      .from('user_ads')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', startOfDay)

    const adsPerDay = activeMembership.memberships.ads_per_day || 0
    if (completedCount >= adsPerDay) {
      return res.status(400).json({ message: 'Daily ad limit reached' })
    }

    const { data: ad, error: adError } = await supabase
      .from('ads')
      .select('*')
      .eq('id', adId)
      .eq('is_active', true)
      .single()

    if (adError || !ad) {
      return res.status(404).json({ message: 'Ad not found' })
    }

    const { data: existing } = await supabase
      .from('user_ads')
      .select('id')
      .eq('user_id', userId)
      .eq('ad_id', adId)
      .gte('created_at', startOfDay)
      .single()

    if (existing) {
      return res.status(400).json({ message: 'Ad already completed today' })
    }

    const rewardAmount = parseFloat(activeMembership.memberships.earn_per_ad || ad.reward_amount || 0)

    await supabase.from('user_ads').insert({
      user_id: userId,
      ad_id: adId,
      status: 'completed',
      reward_amount: rewardAmount,
      clicked_at: new Date().toISOString(),
      completed_at: new Date().toISOString(),
    })

    const { data: wallet } = await supabase
      .from('wallet')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (wallet) {
      const newBalance = parseFloat(wallet.balance) + rewardAmount
      const newTotalEarned = parseFloat(wallet.total_earned) + rewardAmount

      await supabase
        .from('wallet')
        .update({
          balance: newBalance,
          total_earned: newTotalEarned,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)

      await supabase.from('wallet_transactions').insert({
        wallet_id: wallet.id,
        type: 'credit',
        amount: rewardAmount,
        description: `Ad reward: ${ad.title}`,
        balance_after: newBalance,
      })

      await supabase.from('earnings').insert({
        user_id: userId,
        type: 'bonus',
        amount: rewardAmount,
        description: `Ad reward: ${ad.title}`,
      })
    }

    res.json({ message: 'Ad completed. Reward credited!', reward: rewardAmount })
  } catch (error) {
    console.error('Complete ad error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

// Admin: CRUD ads
const getAllAds = async (req, res) => {
  try {
    const { data: ads, error } = await supabase
      .from('ads')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return res.status(500).json({ message: 'Error fetching ads', error: error.message })
    }

    res.json({ ads: ads || [] })
  } catch (error) {
    console.error('Get all ads error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

const createAd = async (req, res) => {
  try {
    const adminId = req.user.userId
    const { title, description, rewardAmount, url, provider, dailyCap, isActive } = req.body

    if (!title || !url) {
      return res.status(400).json({ message: 'Title and URL are required' })
    }

    const { data: ad, error } = await supabase
      .from('ads')
      .insert({
        title,
        description,
        reward_amount: parseFloat(rewardAmount || 0),
        url,
        provider: provider || 'manual',
        daily_cap: dailyCap ? parseInt(dailyCap, 10) : 0,
        is_active: isActive !== false,
      })
      .select()
      .single()

    if (error) {
      return res.status(500).json({ message: 'Error creating ad', error: error.message })
    }

    const { logAdminActivity } = require('./adminController')
    await logAdminActivity(adminId, 'CREATE_AD', 'ads', ad.id, { title })

    res.status(201).json({ message: 'Ad created', ad })
  } catch (error) {
    console.error('Create ad error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

const updateAd = async (req, res) => {
  try {
    const adminId = req.user.userId
    const { id } = req.params
    const { title, description, rewardAmount, url, provider, dailyCap, isActive } = req.body

    const updateData = {}
    if (title) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (rewardAmount !== undefined) updateData.reward_amount = parseFloat(rewardAmount)
    if (url) updateData.url = url
    if (provider) updateData.provider = provider
    if (dailyCap !== undefined) updateData.daily_cap = parseInt(dailyCap, 10)
    if (isActive !== undefined) updateData.is_active = isActive
    updateData.updated_at = new Date().toISOString()

    const { data: ad, error } = await supabase
      .from('ads')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return res.status(500).json({ message: 'Error updating ad', error: error.message })
    }

    const { logAdminActivity } = require('./adminController')
    await logAdminActivity(adminId, 'UPDATE_AD', 'ads', id, updateData)

    res.json({ message: 'Ad updated', ad })
  } catch (error) {
    console.error('Update ad error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

const deleteAd = async (req, res) => {
  try {
    const adminId = req.user.userId
    const { id } = req.params

    const { error } = await supabase
      .from('ads')
      .delete()
      .eq('id', id)

    if (error) {
      return res.status(500).json({ message: 'Error deleting ad', error: error.message })
    }

    const { logAdminActivity } = require('./adminController')
    await logAdminActivity(adminId, 'DELETE_AD', 'ads', id, {})

    res.json({ message: 'Ad deleted' })
  } catch (error) {
    console.error('Delete ad error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

const handleOfferwallCallback = async (req, res) => {
  try {
    const { provider } = req.query
    const payload = req.body || {}
    const providedSecret = req.headers['x-offerwall-secret'] || payload.secret || req.query.secret

    const envKey = `OFFERWALL_SECRET_${String(provider || '').toUpperCase()}`
    const expectedSecret = process.env[envKey] || process.env.OFFERWALL_SHARED_SECRET

    if (expectedSecret && providedSecret !== expectedSecret) {
      return res.status(401).json({ message: 'Invalid signature' })
    }

    const userId = payload.user_id || payload.userId
    const amount = parseFloat(payload.amount || payload.reward || 0)
    const eventType = payload.event || payload.status || 'completed'

    await supabase.from('offerwall_events').insert({
      provider: provider || 'unknown',
      user_id: userId || null,
      event_type: eventType,
      amount: amount || 0,
      raw_payload: payload,
    })

    if (userId && amount > 0) {
      const { data: wallet } = await supabase
        .from('wallet')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (wallet) {
        const newBalance = parseFloat(wallet.balance) + amount
        const newTotalEarned = parseFloat(wallet.total_earned) + amount

        await supabase
          .from('wallet')
          .update({
            balance: newBalance,
            total_earned: newTotalEarned,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userId)

        await supabase.from('wallet_transactions').insert({
          wallet_id: wallet.id,
          type: 'credit',
          amount,
          description: `Offerwall reward (${provider})`,
          balance_after: newBalance,
        })

        await supabase.from('earnings').insert({
          user_id: userId,
          type: 'bonus',
          amount,
          description: `Offerwall reward (${provider})`,
        })
      }
    }

    res.json({ message: 'Callback processed' })
  } catch (error) {
    console.error('Offerwall callback error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

module.exports = {
  getAds,
  completeAd,
  getAllAds,
  createAd,
  updateAd,
  deleteAd,
  handleOfferwallCallback,
}
