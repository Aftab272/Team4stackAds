import React, { useState, useEffect } from 'react'
import { Container, Card, Badge, Button } from 'react-bootstrap'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import './Page.css'
import './OfficialChannel.css'
import communityImg from '../assets/community.webp'
import offersImg from '../assets/offers.png'

const OfficialChannel = () => {
  const navigate = useNavigate()
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/announcements`)
      setAnnouncements(response.data.announcements || [])
    } catch (error) {
      console.error('Error fetching announcements:', error)
    } finally {
      setLoading(false)
    }
  }

  const appLinks = [
    {
      name: 'WhatsApp',
      href: 'https://wa.me/923027434569',
      bg: 'success',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg',
      label: 'WhatsApp'
    },
    {
      name: 'Telegram',
      href: 'https://t.me/yourchannel',
      bg: 'info',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg',
      label: 'Telegram'
    },
    {
      name: 'Botim',
      href: 'https://g.botim.me/invite',
      bg: 'dark',
      logo: 'https://cdn-icons-png.flaticon.com/512/5968/5968920.png',
      label: 'Botim'
    }
  ]

  return (
    <Container className="page-container">
      <div className="back-button-container">
        <button
          type="button"
          className="back-dashboard-button"
          onClick={() => navigate('/quick-actions')}
        >
          <FiArrowLeft />
          Back to Quick Actions
        </button>
      </div>
      <div className="official-title-box">
        <h1 className="page-title official-title">Official Channel</h1>
      </div>
      
      <Card className="page-card official-card mb-4">
        <Card.Body>
          <h4 className="mb-3">Connect with us</h4>
          <p className="text-muted">Join our official channels to get updates, support, and announcements directly.</p>

          <div className="d-flex flex-column gap-3 align-items-center">
            {appLinks.map((app) => (
              <a
                key={app.name}
                href={app.href}
                target="_blank"
                rel="noreferrer"
                className={`btn btn-${app.bg} d-flex flex-column align-items-center justify-content-center text-white app-box`}
                style={{ textDecoration: 'none' }}
              >
                <img src={app.logo} alt={app.name} width={40} height={40} />
                <span className="mt-2" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  {app.label}
                </span>
              </a>
            ))}
          </div>

          <div className="community-offers-grid">
            <a
              className="community-offers-card"
              href="https://whatsapp.com/channel/0029VbCVtZ7Id7nSBLYXOQ1c"
              target="_blank"
              rel="noreferrer"
            >
              <img src={communityImg} alt="Community" />
              <h5>Community</h5>
            </a>
            <a
              className="community-offers-card"
              href="https://whatsapp.com/channel/0029VbCVtZ7Id7nSBLYXOQ1c"
              target="_blank"
              rel="noreferrer"
            >
              <img src={offersImg} alt="Offers" />
              <h5>Offers</h5>
            </a>
          </div>
        </Card.Body>
      </Card>

      <Card className="page-card official-card mb-4">
        <Card.Body>
          <h4 className="mb-3">Earning Opportunity</h4>
          <p className="text-muted">Join our earning website to participate in various activities and earn money. Connect with our channels for more details and updates!</p>
        </Card.Body>
      </Card>

      {announcements.length === 0 ? (
        <Card className="page-card official-card">
          <Card.Body>
            <p className="text-center text-muted">No announcements at the moment. Check back later!</p>
          </Card.Body>
        </Card>
      ) : (
        announcements.map((announcement) => (
          <Card key={announcement.id} className="page-card official-card mb-3">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h4>{announcement.title}</h4>
                <Badge bg="primary">{new Date(announcement.created_at).toLocaleDateString()}</Badge>
              </div>
              <p className="text-muted">{announcement.content}</p>
              {announcement.is_important && (
                <Badge bg="danger" className="mt-2">Important</Badge>
              )}
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  )
}

export default OfficialChannel
