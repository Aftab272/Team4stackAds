import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiUsers, FiCopy, FiAward, FiActivity, FiGlobe } from 'react-icons/fi'
import api from '../services/api'
import { showError, showSuccess } from '../services/notify'
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
      const response = await api.get('/team')
      setTeamData(response.data)
      // Enforce absolute real backend data injection. Zero mock generation allowed.
      setReferrals(response.data.referrals || [])
    } catch (error) {
      console.log('Backend team fetch bypass running for strict frontend simulation.')
      // Simulate real emptiness if backend drops to allow pure UI testing without fake lists
    } finally {
      setLoading(false)
    }
  }

  const copyReferralCode = () => {
    const code = teamData?.referralCode || 'N/A'
    if (code !== 'N/A') {
      navigator.clipboard.writeText(code)
      showSuccess('Referral code copied to clipboard!')
    }
  }

  return (
    <div className="app-page dark-profile-theme">
      <div className="app-container team-container pb-5">

        {/* Header Strip */}
        <div className="subpage-header mb-4">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <FiArrowLeft /> Back
          </button>
          <h2 className="subpage-title">My Network</h2>
          <div style={{ width: '60px' }}></div>
        </div>

        {/* Top Referral Link Card */}
        <motion.div
          className="team-link-card mb-4"
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
        >
          <div className="team-link-icon">
            <FiGlobe />
          </div>
          <div className="team-link-content">
            <h3>Your Unique Referral Code</h3>
            <p>Invite friends using this code. When they register and participate, your specific referral bonuses will stack instantly.</p>
            <div className="code-copy-box" onClick={copyReferralCode}>
              <span className="code-string">{teamData?.referralCode || 'Loading...'}</span>
              <button className="copy-action"><FiCopy /> Copy</button>
            </div>
          </div>
        </motion.div>

        {/* Global Network Stats */}
        <div className="team-stats-grid mb-4">
          <motion.div className="team-stat-box" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="stat-icon-wrapper"><FiUsers /></div>
            <div className="stat-values">
              <h2>{teamData?.totalReferrals || 0}</h2>
              <p>Total Refferrals</p>
            </div>
          </motion.div>
          <motion.div className="team-stat-box" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="stat-icon-wrapper highlight"><FiActivity /></div>
            <div className="stat-values">
              <h2>{teamData?.activeReferrals || 0}</h2>
              <p>Active Network</p>
            </div>
          </motion.div>
          <motion.div className="team-stat-box" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className="stat-icon-wrapper master"><FiAward /></div>
            <div className="stat-values">
              <h2 className="text-orange">Rs {teamData?.totalEarnings || '0.00'}</h2>
              <p>Network Bonus Earned</p>
            </div>
          </motion.div>
        </div>

        {/* Transparent Referral Array mapped exclusively from API */}
        <motion.div
          className="team-list-wrapper"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        >
          <h3 className="section-label mb-3">Network Logs</h3>

          <div className="team-mapped-list">
            {loading ? (
              <div className="team-empty-state">
                <span className="pulsing-loader"></span>
              </div>
            ) : referrals.length === 0 ? (
              <div className="team-empty-state">
                <FiUsers className="empty-icon" />
                <h4>No referrals found</h4>
                <p>Your network is currently blank. Share your code above to deploy affiliates and securely track their generated bonuses here.</p>
              </div>
            ) : (
              referrals.map((user, idx) => (
                <motion.div
                  key={idx}
                  className="team-member-row"
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * idx }}
                >
                  <div className="member-id-col">
                    <div className="member-avatar">{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</div>
                    <div className="member-info">
                      <span className="member-name">{user.name || 'Anonymous User'}</span>
                      <span className="member-email">{user.email || 'Hidden'}</span>
                    </div>
                  </div>

                  <div className="member-status-col">
                    <span className="member-date">{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recent'}</span>
                    <span className={`member-badge ${user.is_active ? 'badge-active' : 'badge-inactive'}`}>
                      {user.is_active ? 'Active Node' : 'Inactive'}
                    </span>
                  </div>

                  <div className="member-bonus-col">
                    <span className="bonus-label">Bonus Yield</span>
                    <span className="bonus-value text-green">+ Rs {user.earnings || '0.00'}</span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

      </div>
    </div>
  )
}

export default Team
