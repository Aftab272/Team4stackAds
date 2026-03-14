import React, { useState, useEffect } from 'react'
import { Container, Card, Form, Button, Alert, Table, Spinner } from 'react-bootstrap'
import axios from 'axios'
import './Page.css'

const Withdraw = () => {
  const [amount, setAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('bank')
  const [accountNumber, setAccountNumber] = useState('')
  const [accountDetails, setAccountDetails] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [withdrawals, setWithdrawals] = useState([])
  const [walletBalance, setWalletBalance] = useState(0)

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
    <Container className="page-container">
      <h1 className="page-title">Withdraw Funds</h1>
      
      <Card className="page-card mb-4">
        <Card.Body>
          <h3>Wallet Balance: ${walletBalance.toFixed(2)}</h3>
          
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
            >
              {loading ? <Spinner size="sm" /> : 'Submit Withdrawal Request'}
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <Card className="page-card">
        <Card.Body>
          <h3>Withdrawal History</h3>
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center">No withdrawals yet</td>
                </tr>
              ) : (
                withdrawals.map((withdrawal) => {
                  const methodNames = {
                    'bank': 'Bank Transfer',
                    'jazzcash': 'JazzCash',
                    'easypaisa': 'EasyPaisa',
                    'paypal': 'PayPal',
                    'crypto': 'Cryptocurrency'
                  }
                  return (
                    <tr key={withdrawal.id}>
                      <td>{new Date(withdrawal.created_at).toLocaleDateString()}</td>
                      <td>${withdrawal.amount}</td>
                      <td>{methodNames[withdrawal.payment_method] || withdrawal.payment_method}</td>
                      <td>
                        <span className={`badge bg-${withdrawal.status === 'approved' ? 'success' : withdrawal.status === 'pending' ? 'warning' : 'danger'}`}>
                          {withdrawal.status}
                        </span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default Withdraw
