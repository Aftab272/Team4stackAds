import React from 'react'
import { Container, Card, ListGroup, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const Notifications = () => {
  const navigate = useNavigate()

  const notifications = [
    {
      id: 1,
      title: 'System Update',
      message: 'The system will be down for maintenance between 02:00-03:00 AM.',
      time: 'Just now'
    },
    {
      id: 2,
      title: 'New Feature',
      message: 'You can now track withdrawals directly from the dashboard.',
      time: '1 hour ago'
    },
    {
      id: 3,
      title: 'Reminder',
      message: 'Don\'t forget to verify your email to secure your account.',
      time: 'Yesterday'
    }
  ]

  return (
    <Container className="py-5">
      <div className="back-button-container mb-3">
        <Button variant="outline-primary" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </Button>
      </div>

      <Card className="shadow">
        <Card.Body>
          <h2>Notifications</h2>
          <p className="text-muted">Only website notifications are shown here.</p>

          <ListGroup variant="flush" className="mt-4">
            {notifications.map((note) => (
              <ListGroup.Item key={note.id} className="d-flex justify-content-between align-items-start">
                <div>
                  <div className="fw-bold">{note.title}</div>
                  <div className="text-muted">{note.message}</div>
                </div>
                <small className="text-muted">{note.time}</small>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default Notifications
