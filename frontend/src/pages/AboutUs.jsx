import React from 'react'
import { Container, Card, Row, Col } from 'react-bootstrap'
import './Page.css'

const AboutUs = () => {
  return (
    <Container className="page-container">
      <h1 className="page-title">About Us</h1>
      
      <Card className="page-card mb-4">
        <Card.Body>
          <h2>Welcome to Team4StackAds</h2>
          <p className="lead">
            We are a leading platform that connects talented individuals with rewarding opportunities.
          </p>
          <p>
            Team4StackAds was founded with a mission to create a fair and transparent ecosystem
            where users can earn by completing tasks and building their teams. We believe in
            rewarding hard work and dedication.
          </p>
        </Card.Body>
      </Card>

      <Row>
        <Col md={4} className="mb-3">
          <Card className="page-card h-100">
            <Card.Body className="text-center">
              <h3>🎯 Our Mission</h3>
              <p>
                To provide a platform where everyone can earn by contributing their skills and
                building a strong community.
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className="page-card h-100">
            <Card.Body className="text-center">
              <h3>💡 Our Vision</h3>
              <p>
                To become the most trusted and rewarding platform for task completion and
                team building.
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className="page-card h-100">
            <Card.Body className="text-center">
              <h3>✨ Our Values</h3>
              <p>
                Transparency, fairness, and user satisfaction are at the core of everything we do.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default AboutUs
