import React from 'react'
import { Container, Row, Col, Card, Button, Nav } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import './Dashboard.css'

const Dashboard = () => {
  const navigate = useNavigate()

  const handleNavigation = (path) => {
    navigate(path)
  }

  const dashboardCards = [
    {
      id: 'withdraw',
      title: 'Withdraw',
      icon: '💰',
      color: '#ff6b35',
      path: '/withdraw',
    },
    {
      id: 'team',
      title: 'Team',
      icon: '👥',
      color: '#ff8c5a',
      path: '/team',
    },
    {
      id: 'guide',
      title: 'Guide',
      icon: '📖',
      color: '#ffa366',
      path: '/guide',
    },
    {
      id: 'official-channel',
      title: 'Official Channel',
      icon: '📢',
      color: '#ff6b35',
      path: '/official-channel',
    },
    {
      id: 'salary',
      title: 'Salary',
      icon: '💵',
      color: '#ff8c5a',
      path: '/salary',
    },
    {
      id: 'work',
      title: 'Work',
      icon: '💼',
      color: '#ffa366',
      path: '/work',
    },
    {
      id: 'about',
      title: 'About Us',
      icon: 'ℹ️',
      color: '#ff6b35',
      path: '/about',
    },
    {
      id: 'contact',
      title: 'Contact Us',
      icon: '📞',
      color: '#ff8c5a',
      path: '/contact',
    },
    {
      id: 'wallet',
      title: 'Wallet',
      icon: '💳',
      color: '#ffa366',
      path: '/wallet',
    },
  ]

  const handleCardClick = (path) => {
    navigate(path)
  }

  return (
    <div className="dashboard-layout">
      {/* Left Sidebar */}
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <Logo size="medium" />
          <h5 className="sidebar-title">Team4stack Ads</h5>
        </div>
        
        <div className="sidebar-nav">
          <Button 
            variant="outline-light" 
            className="sidebar-btn active"
            onClick={() => handleNavigation('/dashboard')}
          >
            🏠 Dashboard
          </Button>
          
          <Button 
            variant="outline-light" 
            className="sidebar-btn"
            onClick={() => handleNavigation('/profile')}
          >
            👤 User Profile
          </Button>
          
          <Button 
            variant="outline-light" 
            className="sidebar-btn"
            onClick={() => handleNavigation('/settings')}
          >
            ⚙️ Settings
          </Button>
          
          <Button 
            variant="outline-light" 
            className="sidebar-btn"
            onClick={() => handleNavigation('/support')}
          >
            🆘 Support
          </Button>
        </div>
        
        <div className="sidebar-footer">
          <Button 
            variant="outline-danger" 
            className="logout-btn-sidebar"
            onClick={() => navigate('/')}
          >
            🚪 Exit
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        <Container fluid className="dashboard-container">
          <div className="dashboard-content">
            <h2 className="content-title">Welcome to Dashboard</h2>
            <p className="content-subtitle">Choose an option to get started</p>
          </div>
          
          <Row className="dashboard-grid">
            {dashboardCards.map((card) => (
              <Col key={card.id} xs={12} sm={6} md={4} lg={4} className="mb-4">
                <Card
                  className="dashboard-card"
                  style={{ backgroundColor: card.color }}
                  onClick={() => handleCardClick(card.path)}
                >
                  <Card.Body className="text-center">
                    <div className="card-icon">{card.icon}</div>
                    <Card.Title className="card-title">{card.title}</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </div>
    </div>
  )
}

export default Dashboard
