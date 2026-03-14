import React, { useState, useEffect } from 'react'
import { Container, Card, Table, Row, Col, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Page.css'

const Wallet = () => {
  const navigate = useNavigate()
  const [walletData, setWalletData] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [withdrawals, setWithdrawals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWalletData()
    fetchWithdrawals()
  }, [])

  const fetchWalletData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/wallet`)
      setWalletData(response.data)
      setTransactions(response.data.transactions || [])
    } catch (error) {
      console.error('Error fetching wallet data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchWithdrawals = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/withdraw`)
      setWithdrawals(response.data.withdrawals || [])
    } catch (error) {
      console.error('Error fetching withdrawals:', error)
    }
  }

  const getWithdrawalStats = () => {
    const stats = { approved: 0, pending: 0, rejected: 0, totalAmount: 0 }
    withdrawals.forEach(withdrawal => {
      if (stats[withdrawal.status] !== undefined) {
        stats[withdrawal.status]++
        stats.totalAmount += withdrawal.amount
      }
    })
    return stats
  }

  const getTotalEarnings = () => {
    return (walletData?.staffEarning || 0) + (walletData?.team4stackEarning || 0)
  }

  const stats = getWithdrawalStats()

  return (
    <div className="dashboard-layout">
      {/* Left Sidebar */}
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <h5 className="sidebar-title">Team4stack Ads</h5>
        </div>

        <div className="sidebar-nav">
          <Button
            variant="outline-light"
            className="sidebar-btn"
            onClick={() => navigate('/dashboard')}
          >
            🏠 Dashboard
          </Button>

          <Button
            variant="outline-light"
            className="sidebar-btn"
            onClick={() => navigate('/profile')}
          >
            👤 User Profile
          </Button>

          <Button
            variant="outline-light"
            className="sidebar-btn"
            onClick={() => navigate('/settings')}
          >
            ⚙️ Settings
          </Button>

          <Button
            variant="outline-light"
            className="sidebar-btn"
            onClick={() => navigate('/support')}
          >
            🆘 Support
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        <Container className="py-5">
          <div className="dashboard-content">
            <h2 className="content-title">💰 My Wallet</h2>
            <p className="content-subtitle">View your balance, earnings, and withdrawal statistics</p>
          </div>

          {/* Statistics Cards */}
          <Row className="mb-4">
            <Col xs={12} sm={6} md={4} className="mb-3">
              <Card className="shadow text-center h-100">
                <Card.Body className="d-flex flex-column justify-content-center wallet-orange">
                  <div className="mb-2">
                    <span className="fs-1">💵</span>
                  </div>
                  <h3 className="mb-1">${walletData?.balance || 0}</h3>
                  <p className="mb-0">Current Balance</p>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} sm={6} md={4} className="mb-3">
              <Card className="shadow text-center h-100">
                <Card.Body className="d-flex flex-column justify-content-center wallet-orange">
                  <div className="mb-2">
                    <span className="fs-1">👨‍💼</span>
                  </div>
                  <h3 className="mb-1">${walletData?.staffEarning || 0}</h3>
                  <p className="mb-0">Staff Earning</p>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} sm={6} md={4} className="mb-3">
              <Card className="shadow text-center h-100">
                <Card.Body className="d-flex flex-column justify-content-center wallet-orange">
                  <div className="mb-2">
                    <span className="fs-1">🏢</span>
                  </div>
                  <h3 className="mb-1">${walletData?.team4stackEarning || 0}</h3>
                  <p className="mb-0">Team4stack Earning</p>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} sm={6} md={4} className="mb-3">
              <Card className="shadow text-center h-100">
                <Card.Body className="d-flex flex-column justify-content-center wallet-orange">
                  <div className="mb-2">
                    <span className="fs-1">💰</span>
                  </div>
                  <h3 className="mb-1">${getTotalEarnings()}</h3>
                  <p className="mb-0">Total Earnings</p>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} sm={6} md={4} className="mb-3">
              <Card className="shadow text-center h-100">
                <Card.Body className="d-flex flex-column justify-content-center wallet-orange">
                  <div className="mb-2">
                    <span className="fs-1">✅</span>
                  </div>
                  <h3 className="mb-1">{stats.approved}</h3>
                  <p className="mb-0">Approved Withdraw</p>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} sm={6} md={4} className="mb-3">
              <Card className="shadow text-center h-100">
                <Card.Body className="d-flex flex-column justify-content-center wallet-orange">
                  <div className="mb-2">
                    <span className="fs-1">⏳</span>
                  </div>
                  <h3 className="mb-1">{stats.pending}</h3>
                  <p className="mb-0">Pending Withdraw</p>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} sm={6} md={4} className="mb-3">
              <Card className="shadow text-center h-100">
                <Card.Body className="d-flex flex-column justify-content-center wallet-orange">
                  <div className="mb-2">
                    <span className="fs-1">❌</span>
                  </div>
                  <h3 className="mb-1">{stats.rejected}</h3>
                  <p className="mb-0">Rejected Withdraw</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Transaction History */}
          <Card className="shadow">
            <Card.Body>
              <h4 className="mb-3">📊 Transaction History</h4>
              <Table responsive striped bordered hover>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center">No transactions yet</td>
                    </tr>
                  ) : (
                    transactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td>{new Date(transaction.created_at).toLocaleDateString()}</td>
                        <td>
                          <span className={`badge bg-${transaction.type === 'credit' ? 'success' : 'danger'}`}>
                            {transaction.type}
                          </span>
                        </td>
                        <td>{transaction.description}</td>
                        <td className={transaction.type === 'credit' ? 'text-success' : 'text-danger'}>
                          {transaction.type === 'credit' ? '+' : '-'}${Math.abs(transaction.amount)}
                        </td>
                        <td>${transaction.balance_after}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </div>
  )
}

export default Wallet
