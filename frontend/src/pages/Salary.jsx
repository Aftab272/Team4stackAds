import React, { useState, useEffect } from 'react'
import { Container, Card, Table, Row, Col } from 'react-bootstrap'
import axios from 'axios'
import './Page.css'

const Salary = () => {
  const [salaryData, setSalaryData] = useState(null)
  const [earnings, setEarnings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSalaryData()
  }, [])

  const fetchSalaryData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/salary`)
      setSalaryData(response.data)
      setEarnings(response.data.earnings || [])
    } catch (error) {
      console.error('Error fetching salary data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container className="page-container">
      <h1 className="page-title">Salary & Earnings</h1>
      
      <Row className="mb-4">
        <Col md={4} className="mb-3">
          <Card className="page-card text-center">
            <Card.Body>
              <h3 className="text-success">${salaryData?.totalEarnings || 0}</h3>
              <p className="text-muted">Total Earnings</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className="page-card text-center">
            <Card.Body>
              <h3 className="text-primary">${salaryData?.thisMonth || 0}</h3>
              <p className="text-muted">This Month</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className="page-card text-center">
            <Card.Body>
              <h3 className="text-warning">${salaryData?.teamBonus || 0}</h3>
              <p className="text-muted">Team Bonus</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="page-card">
        <Card.Body>
          <h3>Earnings History</h3>
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Type</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {earnings.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center">No earnings yet</td>
                </tr>
              ) : (
                earnings.map((earning) => (
                  <tr key={earning.id}>
                    <td>{new Date(earning.created_at).toLocaleDateString()}</td>
                    <td>{earning.description}</td>
                    <td>
                      <span className={`badge bg-${earning.type === 'task' ? 'primary' : earning.type === 'referral' ? 'success' : 'warning'}`}>
                        {earning.type}
                      </span>
                    </td>
                    <td>${earning.amount}</td>
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

export default Salary
