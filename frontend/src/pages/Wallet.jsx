import React, { useState, useEffect } from 'react'
import { Container, Card, Table, Row, Col } from 'react-bootstrap'
import axios from 'axios'
import './Page.css'

const Wallet = () => {
  const [walletData, setWalletData] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWalletData()
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

  return (
    <Container className="page-container">
      <h1 className="page-title">My Wallet</h1>
      
      <Row className="mb-4">
        <Col md={6} className="mb-3">
          <Card className="page-card text-center">
            <Card.Body>
              <h2 className="text-success">${walletData?.balance || 0}</h2>
              <p className="text-muted">Available Balance</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-3">
          <Card className="page-card text-center">
            <Card.Body>
              <h2 className="text-primary">${walletData?.totalEarned || 0}</h2>
              <p className="text-muted">Total Earned</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="page-card">
        <Card.Body>
          <h3>Transaction History</h3>
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
  )
}

export default Wallet
