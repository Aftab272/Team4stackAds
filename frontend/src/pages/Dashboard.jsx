import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiDollarSign, FiUsers, FiVolume2,
  FiPhone, FiCreditCard, FiActivity, FiAward,
  FiArrowUpRight, FiZap, FiBell, FiChevronRight, FiCheckSquare
} from 'react-icons/fi'
import './Dashboard.css'

const Dashboard = () => {
  const navigate = useNavigate()
  const [userName] = useState(localStorage.getItem('userName') || 'User')
  const rawRole = localStorage.getItem('userRole') || ''
  const isAdmin = rawRole.toLowerCase() === 'admin'
  const displayName = isAdmin ? 'User' : userName

  const [stats, setStats] = useState({
    balance: 0,
    totalEarned: 0,
    teamMembers: 0,
    tasksCompleted: 0
  })

  useEffect(() => {
    setStats({
      balance: 1450.50, // Demo balance
      totalEarned: 3200.75,
      teamMembers: 12,
      tasksCompleted: 48
    })
  }, [])

  const handleNavigation = (path) => navigate(path)

  const quickStats = [
    { id: 'team', title: 'Active Referrals', value: stats.teamMembers, icon: FiUsers },
    { id: 'tasks', title: 'Tasks Finished', value: stats.tasksCompleted, icon: FiCheckSquare }
  ]

  const dashboardCards = [
    { id: 'withdraw', title: 'Withdraw', description: 'Cash out seamlessly', icon: FiDollarSign, path: '/withdraw' },
    { id: 'team', title: 'My Team', description: 'Manage your referrals', icon: FiUsers, path: '/team' },
    { id: 'work', title: 'Tasks', description: 'Watch ads & earn', icon: FiAward, path: '/work' },
    { id: 'wallet', title: 'Wallet History', description: 'Track all transactions', icon: FiCreditCard, path: '/wallet' },
    { id: 'official-channel', title: 'Updates', description: 'Latest news & announcements', icon: FiVolume2, path: '/official-channel' },
    { id: 'support', title: 'Help & Support', description: 'We are here for you', icon: FiPhone, path: '/contact' },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  }

  return (
    <>
      <motion.header
        className="app-header"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div>
          <p className="app-kicker">Good to see you</p>
          <h1 className="app-title">
            <span className="app-title-accent">Team4Stack</span>
            <FiZap className="sparkle-icon" size={24} />
          </h1>
        </div>
        <div className="header-actions">
          {isAdmin && (
            <button type="button" className="ghost-pill" onClick={() => handleNavigation('/admin/dashboard')}>
              Admin View
            </button>
          )}
          <button type="button" className="icon-button" onClick={() => handleNavigation('/notifications')} aria-label="Notifications">
            <FiBell size={20} />
            <span className="icon-indicator" />
          </button>
          <div className="avatar-pill" onClick={() => handleNavigation('/profile')} style={{ cursor: 'pointer' }}>
            {displayName.charAt(0).toUpperCase()}
          </div>
        </div>
      </motion.header>

      <motion.section
        className="balance-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.5, ease: 'easeOut' }}
      >
        <div className="balance-top">
          <div>
            <p className="balance-label">Total Balance</p>
            <h2 className="balance-value">${stats.balance.toFixed(2)}</h2>
          </div>
          <button type="button" className="ghost-pill" onClick={() => handleNavigation('/wallet')}>
            Wallet <FiChevronRight />
          </button>
        </div>
        <div className="balance-bottom">
          <div className="balance-meta">
            <span>Lifetime Earnings</span>
            <strong>${stats.totalEarned.toFixed(2)}</strong>
          </div>
          <button type="button" className="primary-pill" onClick={() => handleNavigation('/withdraw')}>
            Withdraw Now
          </button>
        </div>
      </motion.section>

      <motion.section className="stats-strip" variants={containerVariants} initial="hidden" animate="visible">
        {quickStats.map((stat) => {
          const IconComponent = stat.icon
          return (
            <motion.div key={stat.id} className="stat-pill" variants={itemVariants}>
              <div className="stat-pill-icon"><IconComponent size={20} /></div>
              <div className="stat-content">
                <p>{stat.title}</p>
                <h3>{stat.value}</h3>
              </div>
            </motion.div>
          )
        })}
      </motion.section>

      <motion.section className="section-block" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <div className="section-head">
          <div>
            <h2>Quick Actions</h2>
            <p>Access your primary tools</p>
          </div>
        </div>

        <motion.div className="action-grid" variants={containerVariants} initial="hidden" animate="visible">
          {dashboardCards.map((card) => {
            const IconComponent = card.icon
            return (
              <motion.div key={card.id} className="action-card" variants={itemVariants} onClick={() => handleNavigation(card.path)}>
                <div className="action-icon"><IconComponent size={24} /></div>
                <div className="action-text">
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </div>
                <FiArrowUpRight className="action-arrow" size={24} />
              </motion.div>
            )
          })}
        </motion.div>
      </motion.section>
    </>
  )
}

export default Dashboard
