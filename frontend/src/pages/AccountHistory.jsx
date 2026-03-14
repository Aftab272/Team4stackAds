import React from 'react'
import { Container, Card } from 'react-bootstrap'

const AccountHistory = () => (
  <Container className="py-5">
    <Card className="shadow">
      <Card.Body>
        <h2>Account History</h2>
        <p>Here you can view your account activity history.</p>
      </Card.Body>
    </Card>
  </Container>
)

export default AccountHistory
