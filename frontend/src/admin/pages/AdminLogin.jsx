import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Card, Form, Button, Alert } from 'react-bootstrap'
import { FiShield, FiMail, FiLock } from 'react-icons/fi'
import '../Admin.css'
import '../../pages/Auth.css'
import api from '../../services/api'

const AdminLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      })

      const { token, user } = response.data

      if (!user || user.role !== 'admin') {
        setError('Access denied. Admin privileges required.')
        localStorage.removeItem('token')
        localStorage.removeItem('userRole')
        return
      }

      localStorage.setItem('token', token)
      localStorage.setItem('userRole', user.role)
      localStorage.setItem('userName', user.name || 'Admin')
      localStorage.setItem('userEmail', user.email || '')

      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh' }}>
      <Container>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
          <Card className="auth-card">
            <Card.Body className="p-5">
              <div className="auth-header">
                <div className="mb-3">
                  <FiShield size={50} style={{ color: '#667eea' }} />
                </div>
                <h2>Admin Login</h2>
                <p>Enter your credentials to access the admin panel</p>
              </div>

              {error && (
                <Alert variant="danger" className="mb-3">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FiMail className="me-2" />
                    Email Address
                  </Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>
                    <FiLock className="me-2" />
                    Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </Form.Group>

                <Button
                  type="submit"
                  className="auth-button w-100"
                  disabled={loading}
                  style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                >
                  {loading ? 'Logging in...' : 'Login to Admin Panel'}
                </Button>
              </Form>

              <div className="auth-footer mt-4">
                <small className="text-muted">
                  Contact system administrator for access
                </small>
              </div>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </div>
  )
}

export default AdminLogin
