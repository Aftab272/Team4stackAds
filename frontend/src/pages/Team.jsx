import React, { useState, useEffect } from 'react'
import { Container, Card, Table, Badge, Alert } from 'react-bootstrap'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import './Page.css'
import './Team.css'

const Team = () => {
  const navigate = useNavigate()
  const [teamData, setTeamData] = useState(null)
  const [referrals, setReferrals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTeamData()
  }, [])

  const fetchTeamData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/team`)
      setTeamData(response.data)
      setReferrals(response.data.referrals || [])
    } catch (error) {
      console.error('Error fetching team data:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyReferralCode = () => {
    const referralCode = teamData?.referralCode || 'N/A'
    navigator.clipboard.writeText(referralCode)
    alert('Referral code copied to clipboard!')
  }

  return (
    <Container className="page-container team-page">
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
      <div className="team-title-box">
        <h1 className="page-title team-title">My Team</h1>
      </div>
      
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <Card className="page-card team-card text-center">
            <Card.Body>
              <h3>{teamData?.totalReferrals || 0}</h3>
              <p className="text-muted">Total Referrals</p>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-4 mb-3">
          <Card className="page-card team-card text-center">
            <Card.Body>
              <h3>{teamData?.activeReferrals || 0}</h3>
              <p className="text-muted">Active Members</p>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-4 mb-3">
          <Card className="page-card team-card text-center">
            <Card.Body>
              <h3>${teamData?.totalEarnings || 0}</h3>
              <p className="text-muted">Team Earnings</p>
            </Card.Body>
          </Card>
        </div>
      </div>

      <Card className="page-card team-card mb-4">
        <Card.Body>
          <h3>Your Referral Code</h3>
          <Alert variant="info" className="d-flex justify-content-between align-items-center">
            <code style={{ fontSize: '1.2rem' }}>{teamData?.referralCode || 'N/A'}</code>
            <button className="btn btn-sm btn-outline-primary" onClick={copyReferralCode}>
              Copy
            </button>
          </Alert>
          <p className="text-muted">
            Share this code with your friends to earn rewards when they sign up!
          </p>
        </Card.Body>
      </Card>

      <Card className="page-card team-card">
        <Card.Body>
          <h3>Referral List</h3>
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Join Date</th>
                <th>Status</th>
                <th>Earnings</th>
              </tr>
            </thead>
            <tbody>
              {referrals.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">No referrals yet</td>
                </tr>
              ) : (
                referrals.map((referral) => (
                  <tr key={referral.id}>
                    <td>{referral.name}</td>
                    <td>{referral.email}</td>
                    <td>{new Date(referral.created_at).toLocaleDateString()}</td>
                    <td>
                      <Badge bg={referral.is_active ? 'success' : 'secondary'}>
                        {referral.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td>${referral.earnings || 0}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default Team
