const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const supabase = require('../database/supabase')

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

const generateReferralCode = () => {
  return 'REF' + Math.random().toString(36).substring(2, 9).toUpperCase()
}

const register = async (req, res) => {
  try {
    const { name, email, password, referralCode } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Generate unique referral code
    let referralCodeUnique = generateReferralCode()
    let isUnique = false
    while (!isUnique) {
      const { data: existingCode } = await supabase
        .from('users')
        .select('id')
        .eq('referral_code', referralCodeUnique)
        .single()
      
      if (!existingCode) {
        isUnique = true
      } else {
        referralCodeUnique = generateReferralCode()
      }
    }

    // Find referrer if referral code provided
    let referredBy = null
    if (referralCode) {
      const { data: referrer } = await supabase
        .from('users')
        .select('id')
        .eq('referral_code', referralCode)
        .single()
      
      if (referrer) {
        referredBy = referrer.id
      }
    }

    // Create user
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        name,
        email,
        password_hash: passwordHash,
        referral_code: referralCodeUnique,
        referred_by: referredBy,
      })
      .select()
      .single()

    if (userError) {
      return res.status(500).json({ message: 'Error creating user', error: userError.message })
    }

    // Create wallet for user
    await supabase.from('wallet').insert({
      user_id: user.id,
      balance: 0,
      total_earned: 0,
    })

    // Create team referral record if referred
    if (referredBy) {
      await supabase.from('team_referrals').insert({
        referrer_id: referredBy,
        referred_id: user.id,
        is_active: true,
      })
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        referral_code: user.referral_code,
      },
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    // Find user
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (userError || !user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash)
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        referral_code: user.referral_code,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

module.exports = { register, login }
