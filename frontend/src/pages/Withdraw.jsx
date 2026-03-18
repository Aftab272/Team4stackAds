import React, { useState, useEffect } from 'react'
import { Container, Card, Form, Button, Alert, Table, Spinner, Row, Col, Badge } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Page.css'
import './Withdraw.css'

const Withdraw = () => {
  const navigate = useNavigate()
  const [amount, setAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('bank')
  const [accountNumber, setAccountNumber] = useState('')
  const [accountDetails, setAccountDetails] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [withdrawals, setWithdrawals] = useState([])
  const [walletBalance, setWalletBalance] = useState(0)
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    fetchWalletBalance()
    fetchWithdrawals()
  }, [])

  const fetchWalletBalance = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/wallet`)
      setWalletBalance(response.data.balance || 0)
    } catch (error) {
      console.error('Error fetching wallet balance:', error)
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

  // Filter withdrawals based on selected status
  const getFilteredWithdrawals = () => {
    if (filterStatus === 'all') return withdrawals
    return withdrawals.filter(withdrawal => withdrawal.status === filterStatus)
  }

  const getStatusCounts = () => {
    const counts = { all: withdrawals.length, approved: 0, pending: 0, rejected: 0 }
    withdrawals.forEach(withdrawal => {
      if (counts[withdrawal.status] !== undefined) {
        counts[withdrawal.status]++
      }
    })
    return counts
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    // Combine account number and details for submission
    const fullAccountDetails = accountNumber
      ? `Account Number: ${accountNumber}\n${accountDetails}`
      : accountDetails

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/withdraw`, {
        amount: parseFloat(amount),
        paymentMethod,
        accountDetails: fullAccountDetails,
      })

      setMessage({ type: 'success', text: 'Withdrawal request submitted successfully!' })
      setAmount('')
      setAccountNumber('')
      setAccountDetails('')
      fetchWalletBalance()
      fetchWithdrawals()
    } catch (error) {
      setMessage({
        type: 'danger',
        text: error.response?.data?.message || 'Failed to submit withdrawal request',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-page">
      <div className="app-container">
        <div className="back-button-container mb-3">
          <button
            type="button"
            className="back-dashboard-button"
            onClick={() => navigate('/quick-actions')}
          >
            ← Back to Dashboard
          </button>
        </div>
        <Container className="py-5">
          <div className="dashboard-content">
            <div className="withdraw-title-box">
              <h2 className="content-title withdraw-title">Withdraw Funds</h2>
            </div>
            <p className="content-subtitle">Request withdrawals and track your withdrawal history</p>
          </div>

          <Row>
            <Col md={8} className="mx-auto">
              <Card className="shadow mb-4">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="mb-0">💰 Wallet Balance</h4>
                    <h3 className="text-success mb-0">${walletBalance.toFixed(2)}</h3>
                  </div>

                  {message.text && <Alert variant={message.type} className="mt-3">{message.text}</Alert>}

                  <Form onSubmit={handleSubmit} className="mt-4">
                    <Form.Group className="mb-3">
                      <Form.Label>Amount</Form.Label>
                      <Form.Control
                        type="number"
                        step="0.01"
                        min="1"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Payment Method</Form.Label>
                      <Form.Select
                        value={paymentMethod}
                        onChange={(e) => {
                          setPaymentMethod(e.target.value)
                          // Clear account number when changing payment method
                          setAccountNumber('')
                        }}
                        required
                      >
                        <option value="bank">Bank Transfer</option>
                        <option value="jazzcash">JazzCash</option>
                        <option value="easypaisa">EasyPaisa</option>
                        <option value="paypal">PayPal</option>
                        <option value="crypto">Cryptocurrency</option>
                      </Form.Select>
                    </Form.Group>

                    {(paymentMethod === 'jazzcash' || paymentMethod === 'easypaisa') && (
                      <Form.Group className="mb-3">
                        <Form.Label>Account Number / Mobile Number</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder={`Enter your ${paymentMethod === 'jazzcash' ? 'JazzCash' : 'EasyPaisa'} account/mobile number`}
                          value={accountNumber}
                          onChange={(e) => setAccountNumber(e.target.value)}
                          required
                        />
                        <Form.Text className="text-muted">
                          Enter the mobile number registered with your {paymentMethod === 'jazzcash' ? 'JazzCash' : 'EasyPaisa'} account
                        </Form.Text>
                      </Form.Group>
                    )}

                    <Form.Group className="mb-3">
                      <Form.Label>
                        {paymentMethod === 'jazzcash' || paymentMethod === 'easypaisa'
                          ? 'Additional Details (Optional)'
                          : 'Account Details'}
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder={
                          paymentMethod === 'jazzcash' || paymentMethod === 'easypaisa'
                            ? 'Enter any additional information (e.g., account holder name)'
                            : 'Enter your account details (account number, bank name, IBAN, etc.)'
                        }
                        value={accountDetails}
                        onChange={(e) => setAccountDetails(e.target.value)}
                        required={paymentMethod !== 'jazzcash' && paymentMethod !== 'easypaisa'}
                      />
                    </Form.Group>

                    <Button
                      variant="primary"
                      type="submit"
                      disabled={loading || parseFloat(amount) > walletBalance}
                      className="w-100"
                    >
                      {loading ? <Spinner size="sm" /> : 'Submit Withdrawal Request'}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>

              <Card className="shadow">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="mb-0">📊 Withdrawal History</h4>
                    <div className="d-flex gap-2 flex-wrap">
                      <Button
                        variant={filterStatus === 'all' ? 'primary' : 'outline-primary'}
                        size="sm"
                        onClick={() => setFilterStatus('all')}
                      >
                        All ({getStatusCounts().all})
                      </Button>
                      <Button
                        variant={filterStatus === 'approved' ? 'success' : 'outline-success'}
                        size="sm"
                        onClick={() => setFilterStatus('approved')}
                      >
                        Approved ({getStatusCounts().approved})
                      </Button>
                      <Button
                        variant={filterStatus === 'pending' ? 'warning' : 'outline-warning'}
                        size="sm"
                        onClick={() => setFilterStatus('pending')}
                      >
                        Pending ({getStatusCounts().pending})
                      </Button>
                      <Button
                        variant={filterStatus === 'rejected' ? 'danger' : 'outline-danger'}
                        size="sm"
                        onClick={() => setFilterStatus('rejected')}
                      >
                        Rejected ({getStatusCounts().rejected})
                      </Button>
                    </div>
                  </div>

                  <Table responsive striped bordered hover>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Method</th>
                        <th>Status</th>
                        <th>Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getFilteredWithdrawals().length === 0 ? (
                        <tr>
                          <td colSpan="5" className="text-center">
                            {filterStatus === 'all' ? 'No withdrawals yet' : `No ${filterStatus} withdrawals`}
                          </td>
                        </tr>
                      ) : (
                        getFilteredWithdrawals().map((withdrawal) => {
                          const methodNames = {
                            'bank': 'Bank Transfer',
                            'jazzcash': 'JazzCash',
                            'easypaisa': 'EasyPaisa',
                            'paypal': 'PayPal',
                            'crypto': 'Cryptocurrency'
                          }
                          const statusColors = {
                            'approved': 'success',
                            'pending': 'warning',
                            'rejected': 'danger'
                          }
                          return (
                            <tr key={withdrawal.id}>
                              <td>{new Date(withdrawal.created_at).toLocaleDateString()}</td>
                              <td>${withdrawal.amount}</td>
                              <td>{methodNames[withdrawal.payment_method] || withdrawal.payment_method}</td>
                              <td>
                                <Badge bg={statusColors[withdrawal.status] || 'secondary'} className="text-uppercase">
                                  {withdrawal.status}
                                </Badge>
                              </td>
                              <td>
                                <small className="text-muted">
                                  {withdrawal.account_details ? withdrawal.account_details.substring(0, 50) + '...' : 'N/A'}
                                </small>
                              </td>
                            </tr>
                          )
                        })
                      )}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  )
}

export default Withdraw
