import React from 'react'
import { Container, Card, Button, Row, Col, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const Settings = () => {
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
            className="sidebar-btn"
            onClick={() => navigate('/profile')}
          >
            👤 User Profile
          </Button>
          
          <Button 
            variant="outline-light" 
            className="sidebar-btn active"
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
            <h2 className="content-title">⚙️ Settings</h2>
            <p className="content-subtitle">Configure your account and application preferences</p>
          </div>
          
          <Row>
            <Col md={8} className="mx-auto">
              <Card className="shadow">
                <Card.Body>
                  <Form>
                    <h5 className="mb-3">Account Settings</h5>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Email Notifications</Form.Label>
                      <Form.Check 
                        type="switch"
                        id="email-notifications"
                        label="Receive email notifications"
                        defaultChecked
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Language</Form.Label>
                      <Form.Select>
                        <option>English</option>
                        <option>Urdu</option>
                        <option>Hindi</option>
                      </Form.Select>
                    </Form.Group>
                    
                    <hr className="my-4" />
                    
                    <h5 className="mb-3">Security Settings</h5>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Current Password</Form.Label>
                      <Form.Control type="password" placeholder="Enter current password" />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>New Password</Form.Label>
                      <Form.Control type="password" placeholder="Enter new password" />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Confirm New Password</Form.Label>
                      <Form.Control type="password" placeholder="Confirm new password" />
                    </Form.Group>
                    
                    <div className="text-center mt-4">
                      <Button variant="success" className="me-2">
                        Save Changes
                      </Button>
                      <Button variant="secondary" onClick={() => navigate('/dashboard')}>
                        Back to Dashboard
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  )
}

export default Settings