import React from 'react'
import { Container, Card, ListGroup } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import './Page.css'
import './Guide.css'

const Guide = () => {
  const navigate = useNavigate()
  const guideSteps = [
    {
      title: 'Getting Started',
      content: 'Create your account and complete your profile to start earning.',
    },
    {
      title: 'Complete Tasks',
      content: 'Visit the Work page to find available tasks. Complete them to earn rewards.',
    },
    {
      title: 'Build Your Team',
      content: 'Share your referral code with friends. Earn bonuses when they join and complete tasks.',
    },
    {
      title: 'Track Earnings',
      content: 'Monitor your earnings in the Salary page. See your total income and bonuses.',
    },
    {
      title: 'Withdraw Funds',
      content: 'Request withdrawals from your Wallet. Funds will be processed within 24-48 hours.',
    },
    {
      title: 'Stay Updated',
      content: 'Check the Official Channel regularly for announcements and updates.',
    },
  ]

  return (
    <Container className="page-container">
      <div className="back-button-container">
        <button
          type="button"
          className="back-dashboard-button"
          onClick={() => navigate('/dashboard')}
        >
          <FiArrowLeft />
          Back Dashboard
        </button>
      </div>
      <div className="guide-title-box">
        <h1 className="page-title guide-title">User Guide</h1>
      </div>
      
      <Card className="page-card guide-card">
        <Card.Body>
          <h2 className="mb-4">Welcome to Team4StackAds!</h2>
          <p className="lead">
            Follow these steps to maximize your earnings and make the most of our platform.
          </p>

          <ListGroup variant="flush" className="mt-4">
            {guideSteps.map((step, index) => (
              <ListGroup.Item key={index} className="guide-item">
                <div className="d-flex align-items-start">
                  <div className="guide-number me-3">{index + 1}</div>
                  <div>
                    <h5>{step.title}</h5>
                    <p className="mb-0">{step.content}</p>
                  </div>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>

          <div className="mt-4 p-3 guide-tips-box">
            <h5>Tips for Success:</h5>
            <ul>
              <li>Complete tasks daily to maximize your earnings</li>
              <li>Invite friends using your referral code to build a strong team</li>
              <li>Check the Official Channel regularly for new opportunities</li>
              <li>Keep your account information up to date for faster withdrawals</li>
            </ul>
          </div>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default Guide
