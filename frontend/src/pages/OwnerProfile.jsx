import React from 'react'
import { Container, Card, Button, Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const OwnerProfile = () => {
  const navigate = useNavigate()

  // Owner details
  const owner = {
    name: 'M Aftab Akram',
    email: 'ranaaftabakram9@gmail.com',
    phone: '03027434569'
  }

  return (
    <div className="dashboard-layout">
      {/* Left Sidebar */}
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <h5 className="sidebar-title">Team4stack Ads</h5>
        </div>
        <div className="sidebar-nav">
          <Button variant="outline-light" onClick={() => navigate('/dashboard')}>
            🏠 Dashboard
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        <div className="back-button-container mb-3">
          <Button variant="outline-primary" onClick={() => navigate('/dashboard')}>
            ← Back to Dashboard
          </Button>
        </div>
        <Container className="py-5">
          <div className="dashboard-content">
            <h2 className="content-title">👑 Owner Profile</h2>
            <p className="content-subtitle">Owner information and contact details</p>
          </div>

          <Row>
            <Col md={6} className="mx-auto">
              <Card className="shadow">
                <Card.Body className="text-center">
                  <div className="profile-avatar bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{width: '100px', height: '100px', fontSize: '2.5rem'}}>
                    👑
                  </div>
                  <h3 className="mt-3">{owner.name}</h3>
                  <p className="text-muted">Application Owner</p>

                  <div className="mt-4">
                    <div className="mb-3">
                      <strong>Email:</strong>
                      <p>{owner.email}</p>
                    </div>
                    <div className="mb-3">
                      <strong>Phone:</strong>
                      <p>{owner.phone}</p>
                    </div>
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

export default OwnerProfile