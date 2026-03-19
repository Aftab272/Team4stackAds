import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Card, Form, Button, Alert } from 'react-bootstrap'
import { FiMail, FiLock, FiUser } from 'react-icons/fi'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { FaGoogle, FaFacebookF, FaApple } from 'react-icons/fa'
import api from '../services/api'
import ReCAPTCHA from 'react-google-recaptcha'
import './Auth.css'

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [referralCode, setReferralCode] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [captchaToken, setCaptchaToken] = useState('')
  const navigate = useNavigate()

  // Temporary: disable auth forms until Supabase keys are configured.
  // This prevents backend `500 Invalid API key` errors while you add env variables.
  const AUTH_DISABLED = false

  const handleDemoContinue = () => {
    // Demo/dev bypass: allow dashboard UI even when backend auth is not configured.
    const randomId = Math.floor(100000000 + Math.random() * 900000000).toString()
    localStorage.setItem('token', 'demo-token')
    localStorage.setItem('userRole', 'user')
    localStorage.setItem('userName', name || 'New User')
    localStorage.setItem('userEmail', email || 'demo@example.com')
    localStorage.setItem('userId', randomId)
    navigate('/dashboard')
  }

  const normalizeError = (raw) => {
    const msg = String(raw || '')
    if (msg.toLowerCase().includes('already')) return 'Account already exists.'
    if (msg.toLowerCase().includes('required')) return 'Name, email and password are required.'
    return 'Registration failed. Please try again.'
  }

  const handleSocialLogin = (provider) => {
    setInfo(`${provider} login is not enabled yet. We'll enable it soon.`)
  }

  const isValidEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).toLowerCase())
  }

  const isStrongPassword = (value) => {
    // Min 8, at least one upper, one lower, one number, one special
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(value)
  }

  const isFormValid = () => {
    if (!name.trim()) return false
    if (!isValidEmail(email)) return false
    if (!isStrongPassword(password)) return false
    if (password !== confirmPassword) return false
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setInfo('')

    if (AUTH_DISABLED) {
      setLoading(false)
      setError('Registration is temporarily disabled. Please configure Supabase keys and try again.')
      return
    }

    setLoading(true)

    try {
      if (password !== confirmPassword) {
        setError('Passwords do not match.')
        return
      }
      if (!isStrongPassword(password)) {
        setError('Use strong password: 8+ chars, upper, lower, number, special.')
        return
      }
      if (!captchaToken) {
        setError('Please complete the CAPTCHA.')
        return
      }

      const response = await api.post('/auth/register', {
        name,
        email,
        password,
        referralCode: referralCode || undefined,
        captchaToken,
      })

      const { token, user } = response.data
      if (!token || !user) {
        setError('Registration failed. Please try again.')
        return
      }

      const randomId = Math.floor(100000000 + Math.random() * 900000000).toString()
      localStorage.setItem('token', token)
      localStorage.setItem('userRole', user.role || 'user')
      localStorage.setItem('userName', user.name || 'User')
      localStorage.setItem('userEmail', user.email || '')
      localStorage.setItem('userId', user.id || randomId)

      navigate('/dashboard')
    } catch (err) {
      setError(normalizeError(err.response?.data?.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      {/* Animated Background Shapes */}
      <div className="auth-bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <Container>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 4rem)' }}>
          <Card className="auth-card border-0 mt-3 mb-3">
            <Card.Body className="p-4 p-md-5">
              <div className="auth-header">
                <div className="auth-icon-wrap">
                  <FiUser size={34} />
                </div>
                <h2>Create Account</h2>
                <p>Start earning by buying packages and watching ads</p>
              </div>

              {error && (
                <Alert variant="danger" className="mb-3 text-center border-0">
                  {error}
                </Alert>
              )}

              {info && (
                <Alert variant="info" className="mb-3 text-center border-0">
                  {info}
                </Alert>
              )}

              {AUTH_DISABLED && (
                <Alert variant="warning" className="mb-3 text-center border-0">
                  Registration is temporarily disabled because backend auth configuration is missing.
                </Alert>
              )}

              {AUTH_DISABLED && (
                <Button
                  type="button"
                  className="auth-button w-100 mb-4"
                  onClick={handleDemoContinue}
                  disabled={loading}
                >
                  Continue to Dashboard (Demo)
                </Button>
              )}

              <div className="auth-social">
                <div className="auth-social-buttons-row">
                  <Button
                    type="button"
                    variant="link"
                    className="social-icon-btn"
                    onClick={() => handleSocialLogin('Google')}
                    disabled={loading}
                    aria-label="Sign up with Google"
                  >
                    <FaGoogle className="social-btn-icon" />
                  </Button>
                  <Button
                    type="button"
                    variant="link"
                    className="social-icon-btn"
                    onClick={() => handleSocialLogin('Facebook')}
                    disabled={loading}
                    aria-label="Sign up with Facebook"
                  >
                    <FaFacebookF className="social-btn-icon" />
                  </Button>
                  <Button
                    type="button"
                    variant="link"
                    className="social-icon-btn"
                    onClick={() => handleSocialLogin('Apple')}
                    disabled={loading}
                    aria-label="Sign up with Apple"
                  >
                    <FaApple className="social-btn-icon" />
                  </Button>
                </div>
                <div className="auth-social-divider">
                  <span>Or sign up with email</span>
                </div>
              </div>

              <Form onSubmit={handleSubmit} className="auth-form">
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <div className="modern-input-group">
                    <FiUser className="input-icon" size={18} />
                    <Form.Control
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      disabled={loading || AUTH_DISABLED}
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <div className="modern-input-group">
                    <FiMail className="input-icon" size={18} />
                    <Form.Control
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading || AUTH_DISABLED}
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <div className="modern-input-group password-input-wrap">
                    <FiLock className="input-icon" size={18} />
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading || AUTH_DISABLED}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label="Password show/hide"
                    >
                      {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Confirm Password</Form.Label>
                  <div className="modern-input-group password-input-wrap">
                    <FiLock className="input-icon" size={18} />
                    <Form.Control
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={loading || AUTH_DISABLED}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      aria-label="Confirm password show/hide"
                    >
                      {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Referral Code (Optional)</Form.Label>
                  <div className="modern-input-group">
                    <span className="input-icon fw-bold" style={{ fontSize: '14px' }}>#</span>
                    <Form.Control
                      type="text"
                      placeholder="REFXXXXXXX"
                      value={referralCode}
                      onChange={(e) => setReferralCode(e.target.value)}
                      disabled={loading || AUTH_DISABLED}
                    />
                  </div>
                </Form.Group>

                <div className="mb-4 d-flex justify-content-center">
                  <div style={{ transform: 'scale(0.95)', transformOrigin: 'center' }}>
                    <ReCAPTCHA
                      sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || ''}
                      onChange={(token) => setCaptchaToken(token || '')}
                      theme="dark"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="auth-button w-100"
                  disabled={loading || !isFormValid() || !captchaToken}
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                </Button>
              </Form>

              <div className="auth-footer">
                Already have an account?
                <a href="/login">Sign In</a>
              </div>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </div>
  )
}

export default Register

