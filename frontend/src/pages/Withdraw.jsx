import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiDollarSign, FiClock, FiCheckSquare, FiXCircle } from 'react-icons/fi'
import api from '../services/api'
import { showError, showSuccess } from '../services/notify'
import './Withdraw.css'

const Withdraw = () => {
  const navigate = useNavigate()
  const [amount, setAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('easypaisa')
  const [accountNumber, setAccountNumber] = useState('')
  const [accountName, setAccountName] = useState('')
  const [loading, setLoading] = useState(false)
  const [withdrawals, setWithdrawals] = useState([])
  const [walletBalance, setWalletBalance] = useState(0)

  useEffect(() => {
    fetchWalletBalance()
    fetchWithdrawals()
  }, [])

  const fetchWalletBalance = async () => {
    try {
      const response = await api.get('/wallet')
      setWalletBalance(response.data.balance || 0)
    } catch (error) {
      console.log("Mock balance active for UI preview")
    }
  }

  const fetchWithdrawals = async () => {
    try {
      const response = await api.get('/withdraw')
      setWithdrawals(response.data.withdrawals || [])
    } catch (error) {
      console.log('Mock withdrawal history bypass active')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const fullAccountDetails = `Account Name: ${accountName}`

    try {
      await api.post('/withdraw', {
        amount: parseFloat(amount),
        paymentMethod,
        accountDetails: fullAccountDetails,
      })

      showSuccess('Withdrawal request submitted successfully! Your funds are pending approval.')
      setAmount('')
      setAccountNumber('')
      setAccountName('')
      fetchWalletBalance()
      fetchWithdrawals()
    } catch (error) {
      showError(error, 'Failed to submit withdrawal request. Please check your balance.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-page dark-profile-theme">
      <div className="app-container withdraw-container pb-5">

        {/* Header Strip */}
        <div className="subpage-header mb-4">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <FiArrowLeft /> Back
          </button>
          <h2 className="subpage-title">Withdraw Funds</h2>
          <div style={{ width: '60px' }}></div>
        </div>

        <div className="withdraw-grid">

          {/* Left Column: Form */}
          <motion.div
            className="withdraw-form-col"
            initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}
          >
            {/* Balance Card */}
            <div className="premium-balance-card mb-4">
              <div className="balance-icon-box">
                <FiDollarSign />
              </div>
              <div className="balance-texts">
                <p>Available USD Balance</p>
                <h2>$ {walletBalance.toFixed(2)}</h2>
              </div>
            </div>

            <form className="withdraw-form-card" onSubmit={handleSubmit}>
              <h3 className="form-heading">Request Payout</h3>

              {/* 2 Method Selectors */}
              <div className="form-group mb-4 mt-3">
                <label className="premium-label">Select Method</label>
                <div className="method-selector-row">
                  <div
                    className={`method-card ${paymentMethod === 'easypaisa' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('easypaisa')}
                  >
                    <div className="method-indicator"></div>
                    <img src="https://easypaisa.com.pk/wp-content/uploads/2023/08/ep-logo.png" alt="EasyPaisa" className="method-logo ep" />
                    <span>EasyPaisa</span>
                  </div>

                  <div
                    className={`method-card ${paymentMethod === 'jazzcash' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('jazzcash')}
                  >
                    <div className="method-indicator"></div>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Jazz_Cash_logo.svg/1200px-Jazz_Cash_logo.svg.png" alt="JazzCash" className="method-logo jc" />
                    <span>JazzCash</span>
                  </div>
                </div>
              </div>

              <div className="form-group mb-3">
                <label className="premium-label">Amount (USD)</label>
                <input
                  type="number" step="0.01" min="1"
                  className="premium-input text-orange fw-bold"
                  style={{ fontSize: '1.2rem' }}
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              <div className="form-group mb-3">
                <label className="premium-label">Account Mobile Number</label>
                <input
                  type="text"
                  className="premium-input"
                  placeholder="03XX XXXXXXX"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  required
                />
              </div>

              <div className="form-group mb-4">
                <label className="premium-label">Account Holder Name</label>
                <input
                  type="text"
                  className="premium-input"
                  placeholder="Enter receiver name officially"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="premium-btn primary-btn w-100"
                disabled={loading || parseFloat(amount) > walletBalance}
              >
                {loading ? 'Processing Ledger...' : 'Submit Withdrawal Request'}
              </button>

            </form>
          </motion.div>

          {/* Right Column: Ledger */}
          <motion.div
            className="withdraw-ledger-col"
            initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
          >
            <div className="ledger-card">
              <h3 className="section-label mb-4">Transaction Ledger</h3>

              <div className="ledger-list">
                {withdrawals.length === 0 ? (
                  <div className="ledger-empty">
                    <FiClock className="empty-clock" />
                    <p>No withdrawals logged yet. Build your balance and initiate your first request securely.</p>
                  </div>
                ) : (
                  withdrawals.map((withdraw) => (
                    <div className="ledger-row" key={withdraw.id}>
                      <div className="ledger-info">
                        <span className="ledger-method">{withdraw.payment_method.toUpperCase()}</span>
                        <span className="ledger-date">{new Date(withdraw.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="ledger-status-col">
                        <span className="ledger-amount">- $ {withdraw.amount}</span>
                        {withdraw.status === 'approved' && <span className="ledger-badge badge-success"><FiCheckSquare /> Approved</span>}
                        {withdraw.status === 'pending' && <span className="ledger-badge badge-pending"><FiClock /> Pending</span>}
                        {withdraw.status === 'rejected' && <span className="ledger-badge badge-danger"><FiXCircle /> Rejected</span>}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}

export default Withdraw
