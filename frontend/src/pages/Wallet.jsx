import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiArrowLeft,
  FiArrowUpRight,
  FiDollarSign,
  FiUsers,
  FiBriefcase,
  FiCheckCircle,
  FiClock,
  FiXCircle
} from 'react-icons/fi'
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
    withdrawals.forEach((withdrawal) => {
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

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value || 0)
  }

  const stats = getWithdrawalStats()

  return (
    <div className="app-page">
      <div className="app-container">
        <div className="page-header">
          <div className="page-header-top">
            <button type="button" className="pill-button" onClick={() => navigate('/dashboard')}>
              <FiArrowLeft />
              Back
            </button>
            <button type="button" className="primary-pill" onClick={() => navigate('/withdraw')}>
              Withdraw
            </button>
          </div>
          <div>
            <h2 className="page-title">My Wallet</h2>
            <p className="page-subtitle">Track balance, earnings, and withdrawals</p>
          </div>
        </div>

        <div className="wallet-hero">
          <span className="chip">Current Balance</span>
          <h3>{formatCurrency(walletData?.balance)}</h3>
          <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-2">
            <div>
              <small>Total Earnings</small>
              <div className="fw-semibold">{formatCurrency(getTotalEarnings())}</div>
            </div>
            <button type="button" className="ghost-pill" onClick={() => navigate('/account-history')}>
              View History
              <FiArrowUpRight className="ms-2" />
            </button>
          </div>
        </div>

        <div className="card-row mb-4">
          <div className="stat-tile">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)' }}>
              <FiUsers size={20} />
            </div>
            <span>Staff Earning</span>
            <h3>{formatCurrency(walletData?.staffEarning)}</h3>
          </div>
          <div className="stat-tile">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #14b8a6 0%, #0f766e 100%)' }}>
              <FiBriefcase size={20} />
            </div>
            <span>Team4stack Earning</span>
            <h3>{formatCurrency(walletData?.team4stackEarning)}</h3>
          </div>
          <div className="stat-tile">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
              <FiDollarSign size={20} />
            </div>
            <span>Total Earnings</span>
            <h3>{formatCurrency(getTotalEarnings())}</h3>
          </div>
          <div className="stat-tile">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' }}>
              <FiCheckCircle size={20} />
            </div>
            <span>Approved Withdraw</span>
            <h3>{stats.approved}</h3>
          </div>
          <div className="stat-tile">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
              <FiClock size={20} />
            </div>
            <span>Pending Withdraw</span>
            <h3>{stats.pending}</h3>
          </div>
          <div className="stat-tile">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>
              <FiXCircle size={20} />
            </div>
            <span>Rejected Withdraw</span>
            <h3>{stats.rejected}</h3>
          </div>
        </div>

        <div className="page-card p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="m-0 text-white">Transaction History</h3>
            {loading && <span className="page-subtitle">Loading...</span>}
          </div>
          <div className="list-card">
            {transactions.length === 0 ? (
              <div className="list-item">
                <h4>No transactions yet</h4>
                <p>Your recent activity will appear here.</p>
              </div>
            ) : (
              transactions.map((transaction) => {
                const isCredit = transaction.type === 'credit'
                return (
                  <div key={transaction.id} className="list-item">
                    <div className="transaction-row">
                      <div>
                        <h4>{transaction.description || 'Wallet Activity'}</h4>
                        <p>{new Date(transaction.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="text-end">
                        <span className={`badge-pill ${isCredit ? 'success' : 'danger'}`}>
                          {transaction.type}
                        </span>
                        <div className={`transaction-amount ${isCredit ? 'text-success' : 'text-danger'}`}>
                          {isCredit ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                        </div>
                      </div>
                    </div>
                    <p className="mt-2">Balance after: {formatCurrency(transaction.balance_after)}</p>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Wallet
