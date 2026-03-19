import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Card, Form, Button, Alert } from 'react-bootstrap'
import { FiMail, FiLock, FiUser } from 'react-icons/fi'
import { FaGoogle, FaFacebookF, FaApple } from 'react-icons/fa'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import api from '../services/api'
import ReCAPTCHA from 'react-google-recaptcha'
import './Auth.css'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)
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
    localStorage.setItem('userName', 'Demo User')
    localStorage.setItem('userEmail', 'demo@example.com')
    localStorage.setItem('userId', randomId)
    navigate('/dashboard')
  }

  const normalizeError = (raw) => {
    const msg = String(raw || '')
    if (msg.toLowerCase().includes('invalid')) return 'Invalid email or password.'
    if (msg.toLowerCase().includes('required')) return 'Email and password are required.'
    return 'Login failed. Please try again.'
  }

  const handleSocialLogin = (provider) => {
    // MVP: social login buttons UI me hain; backend integration baad me karni hai.
    setInfo(`${provider} login is not enabled yet. We'll enable it soon.`)
  }

  const isValidEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).toLowerCase())
  }

  const canSubmit = () => {
    if (!isValidEmail(email)) return false
    if (String(password).length < 1) return false
    if (!captchaToken) return false
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setInfo('')

    if (AUTH_DISABLED) {
      setLoading(false)
      setError('Login is temporarily disabled. Please configure Supabase keys and try again.')
      return
    }

    setLoading(true)

    try {
      if (!captchaToken) {
        setError('Please complete the CAPTCHA.')
        return
      }
      const response = await api.post('/auth/login', { email, password, captchaToken })
      const { token, user } = response.data

      if (!token || !user) {
        setError('Login failed. Please try again.')
        return
      }

      const randomId = Math.floor(100000000 + Math.random() * 900000000).toString()
      localStorage.setItem('token', token)
      localStorage.setItem('userRole', user.role || 'user')
      localStorage.setItem('userName', user.name || 'User')
      localStorage.setItem('userEmail', user.email || '')
      localStorage.setItem('userId', user.id || randomId)

      if (user.role === 'admin') {
        navigate('/admin/dashboard')
      } else {
        navigate('/dashboard')
      }
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
          <Card className="auth-card border-0">
            <Card.Body className="p-4 p-md-5">
              <div className="auth-header">
                <div className="auth-icon-wrap">
                  <FiUser size={34} />
                </div>
                <h2>Welcome Back</h2>
                <p>Sign in to your Team4stackAds account</p>
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
                  Login is temporarily disabled because backend auth configuration is missing.
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
                    aria-label="Continue with Google"
                  >
                    <FaGoogle className="social-btn-icon" />
                  </Button>
                  <Button
                    type="button"
                    variant="link"
                    className="social-icon-btn"
                    onClick={() => handleSocialLogin('Facebook')}
                    disabled={loading}
                    aria-label="Continue with Facebook"
                  >
                    <FaFacebookF className="social-btn-icon" />
                  </Button>
                  <Button
                    type="button"
                    variant="link"
                    className="social-icon-btn"
                    onClick={() => handleSocialLogin('Apple')}
                    disabled={loading}
                    aria-label="Continue with Apple"
                  >
                    <FaApple className="social-btn-icon" />
                  </Button>
                </div>
                <div className="auth-social-divider">
                  <span>Or continue with email</span>
                </div>
              </div>

              <Form onSubmit={handleSubmit} className="auth-form">
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

                <Form.Group className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <div className="modern-input-group password-input-wrap">
                    <FiLock className="input-icon" size={18} />
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
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

                <div className="mb-4 d-flex justify-content-center">
                  <div style={{ transform: 'scale(0.95)', transformOrigin: 'center' }}>
                    <ReCAPTCHA
                      sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || ''}
                      onChange={(token) => setCaptchaToken(token || '')}
                      theme="dark"
                    />
                  </div>
                </div>

                <Button type="submit" className="auth-button w-100" disabled={loading || !canSubmit()}>
                  {loading ? 'Logging in...' : 'Sign In'}
                </Button>
              </Form>

              <div className="auth-footer">
                Don’t have an account?
                <a href="/register">Create one</a>
              </div>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </div>
  )
}

export default Login

