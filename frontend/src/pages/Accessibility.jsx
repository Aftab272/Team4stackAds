import React from 'react'
import { Container, Card, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const Accessibility = () => {
  const navigate = useNavigate()

  return (
    <Container className="py-5">
      <div className="back-button-container mb-3">
        <Button variant="outline-primary" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </Button>
      </div>
      <Card className="shadow">
        <Card.Body>
          <h2>Accessibility</h2>
          <p>Accessibility settings help you configure font size, contrast, and more.</p>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default Accessibility
