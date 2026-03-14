import React from 'react'
import { Container, Card, Button, Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const UserProfile = () => {
  const navigate = useNavigate()

  return (
    <div className="dashboard-layout">
      {/* Left Sidebar */}
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <h5 className="sidebar-title">TEAM 4stack Ads</h5>
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
            <h2 className="content-title">👤 User Profile</h2>
            <p className="content-subtitle">Manage your account information</p>
          </div>
          
          <Row>
            <Col md={8} className="mx-auto">
              <Card className="shadow">
                <Card.Body>
                  <div className="text-center mb-4">
                    <div className="profile-avatar bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{width: '80px', height: '80px', fontSize: '2rem'}}>
                      U
                    </div>
                    <h4 className="mt-3">Demo User</h4>
                  </div>
                  
                  <div className="profile-details">
                    <div className="mb-3">
                      <strong>Name:</strong> Demo User
                    </div>
                    <div className="mb-3">
                      <strong>Email:</strong> demo@example.com
                    </div>
                    <div className="mb-3">
                      <strong>Referral Code:</strong> DEMO123
                    </div>
                    <div className="mb-3">
                      <strong>Member Since:</strong> {new Date().toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="text-center mt-4">
                    <Button variant="primary" className="me-2">
                      Edit Profile
                    </Button>
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