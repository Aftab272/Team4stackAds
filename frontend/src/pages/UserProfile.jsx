import React, { useState } from 'react'
import { Container, Card, Button, Row, Col, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const UserProfile = () => {
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)

  // User data
  const [user, setUser] = useState({
    name: 'Demo User',
    email: 'demo@example.com',
    referralCode: 'DEMO123',
    memberSince: '14/03/2026'
  })

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    setIsEditing(false)
    // Here you would typically save to backend
    alert('Profile updated successfully!')
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reset to original values if needed
  }

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="dashboard-layout">
      {/* Left Sidebar */}
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <h5 className="sidebar-title">Team4stack Ads</h5>
        </div>
        
        <div className="sidebar-nav">
          <Button 
            variant="outline-light" 
            className="sidebar-btn"
            onClick={() => navigate('/dashboard')}
          >
            🏠 Dashboard
          </Button>
          
          <Button 
            variant="outline-light" 
            className="sidebar-btn active"
            onClick={() => navigate('/profile')}
          >
            👤 User Profile
          </Button>
          
          <Button 
            variant="outline-light" 
            className="sidebar-btn"
            onClick={() => navigate('/settings')}
          >
            ⚙️ Settings
          </Button>
          
          <Button 
            variant="outline-light" 
            className="sidebar-btn"
            onClick={() => navigate('/support')}
          >
            🆘 Support
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        <Container className="py-5">
          <div className="dashboard-content">
            <h2 className="content-title">👤 {user.name}'s Profile</h2>
            <p className="content-subtitle">Manage your account information</p>
          </div>
          
          <Row>
            <Col md={8} className="mx-auto">
              <Card className="shadow">
                <Card.Body>
                  <div className="text-center mb-4">
                    <div className="profile-avatar bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{width: '80px', height: '80px', fontSize: '2rem'}}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <h4 className="mt-3">{user.name}</h4>
                  </div>
                  
                  <div className="profile-details">
                    <div className="mb-3">
                      <strong>Name:</strong>
                      {isEditing ? (
                        <Form.Control
                          type="text"
                          name="name"
                          value={user.name}
                          onChange={handleChange}
                          className="mt-1"
                        />
                      ) : (
                        <span className="ms-2">{user.name}</span>
                      )}
                    </div>
                    <div className="mb-3">
                      <strong>Email:</strong>
                      {isEditing ? (
                        <Form.Control
                          type="email"
                          name="email"
                          value={user.email}
                          onChange={handleChange}
                          className="mt-1"
                        />
                      ) : (
                        <span className="ms-2">{user.email}</span>
                      )}
                    </div>
                    <div className="mb-3">
                      <strong>Referral Code:</strong>
                      <span className="ms-2">{user.referralCode}</span>
                    </div>
                    <div className="mb-3">
                      <strong>Member Since:</strong>
                      <span className="ms-2">{user.memberSince}</span>
                    </div>
                  </div>
                  
                  <div className="text-center mt-4">
                    {isEditing ? (
                      <>
                        <Button variant="success" onClick={handleSave} className="me-2">
                          Save Changes
                        </Button>
                        <Button variant="secondary" onClick={handleCancel} className="me-2">
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button variant="primary" onClick={handleEdit} className="me-2">
                        Edit Profile
                      </Button>
                    )}
                    <Button variant="secondary" onClick={() => navigate('/dashboard')}>
                      Back to Dashboard
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  )
}

export default UserProfile