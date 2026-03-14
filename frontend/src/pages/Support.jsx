import React, { useState } from 'react'
import { Container, Card, Button, Row, Col, Form, Alert } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const Support = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    priority: 'normal'
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the support request to your backend
    console.log('Support request:', formData)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
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
            className="sidebar-btn"
            onClick={() => navigate('/settings')}
          >
            ⚙️ Settings
          </Button>
          
          <Button 
            variant="outline-light" 
            className="sidebar-btn active"
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
            <h2 className="content-title">🆘 Support Center</h2>
            <p className="content-subtitle">Get help and assistance with your account</p>
          </div>
          
          <Row>
            <Col md={8} className="mx-auto">
              <Card className="shadow">
                <Card.Body>
                  {submitted && (
                    <Alert variant="success" className="mb-4">
                      ✅ Your support request has been submitted successfully! We'll get back to you soon.
                    </Alert>
                  )}
                  
                  <div className="mb-4">
                    <h5>Need Help?</h5>
                    <p className="text-muted">
                      Our support team is here to help you with any questions or issues you may have.
                      Please fill out the form below and we'll respond as quickly as possible.
                    </p>
                  </div>
                  
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Subject</Form.Label>
                      <Form.Control
                        type="text"
                        name="subject"
                        placeholder="Brief description of your issue"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Priority</Form.Label>
                      <Form.Select 
                        name="priority" 
                        value={formData.priority}
                        onChange={handleChange}
                      >
                        <option value="low">Low - General inquiry</option>
                        <option value="normal">Normal - Standard support</option>
                        <option value="high">High - Urgent issue</option>
                        <option value="critical">Critical - System down</option>
                      </Form.Select>
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Message</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={5}
                        name="message"
                        placeholder="Please describe your issue in detail..."
                        value={formData.message}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    
                    <div className="text-center mt-4">
                      <Button variant="warning" type="submit" className="me-2">
                        Submit Support Request
                      </Button>
                      <Button variant="secondary" onClick={() => navigate('/dashboard')}>
                        Back to Dashboard
                      </Button>
                    </div>
                  </Form>
                  
                  <hr className="my-4" />
                  
                  <div className="text-center">
                    <h6>Other Ways to Contact Us</h6>
                    <p className="mb-1">
                      <strong>Email:</strong> kk34samikhan@gmail.com, ranaaftabakram9@gmail.com, team4stack@gmail.com
                    </p>
                    <p className="mb-1">
                      <strong>Phone:</strong> 03027434569, 03083266634
                    </p>
                    <p className="mb-0">
                      <strong>Response Time:</strong> 24-48 hours
                    </p>
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

export default Support