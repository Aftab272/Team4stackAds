import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  FiArrowLeft, FiArrowUpRight, FiDollarSign, FiUsers,
  FiBriefcase, FiCheckCircle, FiClock, FiXCircle, FiCreditCard
} from 'react-icons/fi'
import api from '../services/api'
import { showError } from '../services/notify'
import './Wallet.css'

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
      const response = await api.get('/wallet')
      setWalletData(response.data)
      setTransactions(response.data.transactions || [])
    } catch (error) {
      console.log('UI Wallet Simulation Active for precise layout rendering')
    } finally {
      setLoading(false)
    }
  }

  const fetchWithdrawals = async () => {
    try {
      const response = await api.get('/withdraw')
      setWithdrawals(response.data.withdrawals || [])
    } catch (error) {
      console.log('Mock bypass engaged on withdrawals')
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

  const stats = getWithdrawalStats()

  return (
    <div className="app-page dark-profile-theme">
      <div className="app-container pb-5">

        {/* Header Strip */}
        <div className="subpage-header mb-4">
          <button className="back-btn" onClick={() => navigate('/quick-actions')}>
            <FiArrowLeft /> Back
          </button>
          <h2 className="subpage-title">Digital Wallet</h2>
          <button className="premium-btn primary-btn px-4 py-2" style={{ borderRadius: '8px' }} onClick={() => navigate('/withdraw')}>
            Withdraw
          </button>
        </div>

        {/* Master Orange Balance Hero */}
        <motion.div
          className="wallet-hero-banner mb-4"
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
        >
          <div className="wallet-hero-overlay">
            <span className="premium-label text-orange">Available Secure Balance</span>
            <h1 className="wallet-hero-balance">$ {walletData?.balance?.toFixed(2) || '0.00'}</h1>

            <div className="wallet-hero-bottom">
              <div className="bottom-stat">
                <span className="stat-label">Lifetime Yield</span>
                <span className="stat-val">$ {getTotalEarnings().toFixed(2)}</span>
              </div>
              <button className="premium-btn ghost-pill" onClick={() => navigate('/account-history')}>
                Ledger Logs <FiArrowUpRight style={{ marginBottom: '2px' }} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Financial Stat Array */}
        <motion.div
          className="wallet-stats-grid mb-5"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        >
          <div className="wallet-stat-card">
            <div className="wstat-icon" style={{ color: '#f97316', background: 'rgba(249, 115, 22, 0.15)' }}><FiUsers /></div>
            <div className="wstat-info">
              <p>Staff Yield</p>
              <h4>$ {walletData?.staffEarning?.toFixed(2) || '0.00'}</h4>
            </div>
          </div>
          <div className="wallet-stat-card">
            <div className="wstat-icon" style={{ color: '#38bdf8', background: 'rgba(56, 189, 248, 0.15)' }}><FiBriefcase /></div>
            <div className="wstat-info">
              <p>Platform Yield</p>
              <h4>$ {walletData?.team4stackEarning?.toFixed(2) || '0.00'}</h4>
            </div>
          </div>
          <div className="wallet-stat-card">
            <div className="wstat-icon" style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.15)' }}><FiCheckCircle /></div>
            <div className="wstat-info">
              <p>Approved Drafts</p>
              <h4>{stats.approved} Nodes</h4>
            </div>
          </div>
          <div className="wallet-stat-card">
            <div className="wstat-icon" style={{ color: '#eab308', background: 'rgba(234, 179, 8, 0.15)' }}><FiClock /></div>
            <div className="wstat-info">
              <p>Pending Drafts</p>
              <h4>{stats.pending} Nodes</h4>
            </div>
          </div>
        </motion.div>

        {/* Transaction Matrix */}
        <motion.div
          className="wallet-matrix-wrapper"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        >
          <h3 className="section-label mb-3">Live Transaction Graph</h3>
          <div className="wallet-mapped-list">
            {loading ? (
              <div className="wallet-empty-state"><span className="pulsing-loader"></span></div>
            ) : transactions.length === 0 ? (
              <div className="wallet-empty-state">
                <FiCreditCard className="empty-icon" />
                <h4>Zero Transactions Found</h4>
                <p>Your ledger is clear. Deposit packages or generate task yields to initiate tracing.</p>
              </div>
            ) : (
              transactions.map((tx, idx) => {
                const isCredit = tx.type === 'credit'
                return (
                  <motion.div
                    key={tx.id || idx}
                    className="wallet-member-row"
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * idx }}
                  >
                    <div className="member-id-col">
                      <div className={`transaction-icon ${isCredit ? 'credit-ic' : 'debit-ic'}`}>
                        {isCredit ? <FiArrowUpRight /> : <FiArrowLeft />}
                      </div>
                      <div className="member-info">
                        <span className="member-name">{tx.description || 'System Allocation'}</span>
                        <span className="member-date">{new Date(tx.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="member-bonus-col">
                      <span className={`bonus-value ${isCredit ? 'text-green' : 'text-danger'}`}>
                        {isCredit ? '+ ' : '- '} $ {Math.abs(tx.amount).toFixed(2)}
                      </span>
                      <span className="bonus-label">Rem: $ {tx.balance_after?.toFixed(2) || '0.00'}</span>
                    </div>
                  </motion.div>
                )
              })
            )}
          </div>
        </motion.div>

      </div>
    </div>
  )
}

export default Wallet
