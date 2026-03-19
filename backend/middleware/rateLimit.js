const buckets = new Map()

const getKey = (req, keyPrefix) => {
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown'
  return `${keyPrefix}:${ip}`
}

const rateLimit = ({ windowMs = 60000, max = 30, keyPrefix = 'default' } = {}) => {
  return (req, res, next) => {
    const key = getKey(req, keyPrefix)
    const now = Date.now()

    const existing = buckets.get(key) || { count: 0, resetAt: now + windowMs }
    if (now > existing.resetAt) {
      existing.count = 0
      existing.resetAt = now + windowMs
    }

    existing.count += 1
    buckets.set(key, existing)

    if (existing.count > max) {
      return res.status(429).json({ message: 'Too many requests. Please try again later.' })
    }

    next()
  }
}

module.exports = { rateLimit }
