const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY

/**
 * Optional reCAPTCHA verification middleware.
 * - If RECAPTCHA_SECRET_KEY is not set, it will bypass verification (dev mode).
 * - Expects token at req.body.captchaToken
 */
const verifyRecaptcha = async (req, res, next) => {
  if (!RECAPTCHA_SECRET) {
    return next()
  }

  try {
    const token = req.body?.captchaToken
    if (!token) {
      return res.status(400).json({ message: 'CAPTCHA is required' })
    }

    const params = new URLSearchParams()
    params.append('secret', RECAPTCHA_SECRET)
    params.append('response', token)
    const verification = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    })
    const result = await verification.json()
    if (!result.success) {
      return res.status(400).json({ message: 'CAPTCHA verification failed' })
    }

    next()
  } catch (error) {
    return res.status(500).json({ message: 'CAPTCHA verification error', error: error.message })
  }
}

module.exports = { verifyRecaptcha }

