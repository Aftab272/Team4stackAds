import React, { useRef } from 'react'
import { Container, Card, Button, Row, Col, Form, ListGroup } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const Settings = () => {
  const navigate = useNavigate()
  const formRef = useRef(null)

  const handleLogout = () => {
    // Placeholder: implement real logout flow
    alert('Logged out successfully')
    navigate('/dashboard')
  }

  const handleSaveChanges = () => {
    // Trigger form submission
    if (formRef.current) {
      formRef.current.requestSubmit()
    }
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
              <Card className="shadow mb-4">
                <Card.Body>
                  <Form ref={formRef} onSubmit={(e) => { e.preventDefault(); alert('Settings saved!'); }}>
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

                  </Form>
                </Card.Body>
              </Card>

              <Card className="shadow">
                <Card.Body>
                  <h5 className="mb-3">More Settings</h5>
                  <ListGroup variant="flush">
                    <ListGroup.Item action onClick={() => navigate('/privacy-policy')}>
                      Privacy Policy
                    </ListGroup.Item>
                    <ListGroup.Item action onClick={() => navigate('/terms')}>
                      Terms & Conditions
                    </ListGroup.Item>
                    <ListGroup.Item action onClick={() => navigate('/account-history')}>
                      Account History
                    </ListGroup.Item>
                    <ListGroup.Item action onClick={() => navigate('/search-history')}>
                      Search History
                    </ListGroup.Item>
                    <ListGroup.Item action onClick={() => navigate('/security-permissions')}>
                      Security & Permissions
                    </ListGroup.Item>
                    <ListGroup.Item action onClick={() => navigate('/accessibility')}>
                      Accessibility
                    </ListGroup.Item>
                    <ListGroup.Item action onClick={() => navigate('/help-center')}>
                      Help Center
                    </ListGroup.Item>
                    <ListGroup.Item action onClick={() => navigate('/terms-policies')}>
                      Terms & Policies
                    </ListGroup.Item>
                    <ListGroup.Item action onClick={handleLogout} className="text-danger">
                      Logout
                    </ListGroup.Item>
                  </ListGroup>

                  <div className="d-flex justify-content-end gap-2 mt-3">
                    <Button variant="success" onClick={handleSaveChanges}>
                      Save Changes
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

export default Settings