import React, { useState, useEffect } from 'react'
import { Container, Card, Badge } from 'react-bootstrap'
import axios from 'axios'
import './Page.css'

const OfficialChannel = () => {
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

  return (
    <Container className="page-container">
      <h1 className="page-title">Official Channel</h1>
      
      {announcements.length === 0 ? (
        <Card className="page-card">
          <Card.Body>
            <p className="text-center text-muted">No announcements at the moment. Check back later!</p>
          </Card.Body>
        </Card>
      ) : (
        announcements.map((announcement) => (
          <Card key={announcement.id} className="page-card mb-3">
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
