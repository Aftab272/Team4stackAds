import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FiDollarSign, FiUsers, FiBook, FiVolume2, FiBriefcase, 
  FiInfo, FiPhone, FiCreditCard, FiActivity, FiAward,
  FiArrowUpRight, FiZap, FiBell, FiChevronRight, FiUser, FiSettings
} from 'react-icons/fi'
import Logo from '../components/Logo'
import './Dashboard.css'

const Dashboard = () => {
  const navigate = useNavigate()
  const [userName] = useState(localStorage.getItem('userName') || 'User')
  const rawRole = localStorage.getItem('userRole') || ''
  const normalizedRole = rawRole.toLowerCase()
  const isAdmin = normalizedRole === 'admin'
  const displayName = isAdmin ? 'User' : userName
  const isLoggedIn = Boolean(localStorage.getItem('token'))
  const [stats, setStats] = useState({
    balance: 0,
    totalEarned: 0,
    teamMembers: 0,
    tasksCompleted: 0
  })

  useEffect(() => {
    setStats({
      balance: 0,
      totalEarned: 0,
      teamMembers: 0,
      tasksCompleted: 0
    })
  }, [])

  useEffect(() => {
    document.body.classList.add('user-dashboard-body')
    return () => {
      document.body.classList.remove('user-dashboard-body')
    }
  }, [])

  const handleNavigation = (path) => {
    navigate(path)
  }

  const handleAuthAction = () => {
    if (isLoggedIn) {
      localStorage.removeItem('token')
      localStorage.removeItem('userRole')
      navigate('/')
      return
    }
    navigate('/')
  }

  const quickStats = [
    {
      id: 'team',
      title: 'Team Members',
      value: stats.teamMembers,
      icon: FiUsers,
      gradient: 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)',
      bgColor: 'rgba(56, 189, 248, 0.14)'
    },
    {
      id: 'tasks',
      title: 'Tasks Completed',
      value: stats.tasksCompleted,
      icon: FiActivity,
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      bgColor: 'rgba(245, 158, 11, 0.16)'
    }
  ]

  const dashboardCards = [
    {
      id: 'withdraw',
      title: 'Withdraw',
      description: 'Withdraw your earnings instantly',
      icon: FiDollarSign,
      gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
      path: '/withdraw',
    },
    {
      id: 'team',
      title: 'My Team',
      description: 'Manage your team members',
      icon: FiUsers,
      gradient: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
      path: '/team',
    },
    {
      id: 'guide',
      title: 'Guide',
      description: 'Learn how to maximize earnings',
      icon: FiBook,
      gradient: 'linear-gradient(135deg, #14b8a6 0%, #0f766e 100%)',
      path: '/guide',
    },
    {
      id: 'official-channel',
      title: 'Official Channel',
      description: 'Stay updated with news',
      icon: FiVolume2,
      gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
      path: '/official-channel',
    },
    {
      id: 'salary',
      title: 'Salary',
      description: 'View your salary details',
      icon: FiBriefcase,
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      path: '/salary',
    },
    {
      id: 'work',
      title: 'Work',
      description: 'Complete tasks and earn',
      icon: FiAward,
      gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
      path: '/work',
    },
    {
      id: 'about',
      title: 'About Us',
      description: 'Learn about our platform',
      icon: FiInfo,
      gradient: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
      path: '/about',
    },
    {
      id: 'contact',
      title: 'Contact Us',
      description: 'Get in touch with support',
      icon: FiPhone,
      gradient: 'linear-gradient(135deg, #0ea5a4 0%, #0f766e 100%)',
      path: '/contact',
    },
    {
      id: 'wallet',
      title: 'Wallet',
      description: 'Manage your wallet',
      icon: FiCreditCard,
      gradient: 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)',
      path: '/wallet',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  return (
    <div className="dashboard-screen">
      <div className="user-dashboard-shell">
        <aside className="user-sidebar">
          <div className="user-sidebar-header">
            <Logo size="small" />
            <div>
              <p className="user-sidebar-kicker">User Panel</p>
              <h2 className="user-sidebar-title">{displayName}</h2>
            </div>
          </div>
          <div className="team4stack-card">
            <button
              type="button"
              className="team4stack-card-toggle"
              onClick={() => handleNavigation('/team4stack-profile')}
            >
              <span>Team4Stack Profile</span>
              <FiChevronRight className="team4stack-chevron" />
            </button>
          </div>

          <nav className="user-sidebar-nav">
            <button
              type="button"
              className="user-sidebar-link"
              onClick={() => handleNavigation('/profile')}
            >
              <FiUser />
              User Profile
            </button>
            <button
              type="button"
              className="user-sidebar-link"
              onClick={() => handleNavigation('/settings')}
            >
              <FiSettings />
              Settings
            </button>
            <button
              type="button"
              className="user-sidebar-link user-sidebar-auth"
              onClick={handleAuthAction}
            >
              <FiArrowUpRight />
              {isLoggedIn ? 'Logout' : 'Login'}
            </button>
          </nav>
        </aside>

        <div className="dashboard-container">
        <motion.header
          className="app-header"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div>
            <p className="app-kicker">Welcome to</p>
            <h1 className="app-title">
              <span className="app-title-accent">Team4Stack Ads</span>
              <FiZap className="sparkle-icon" />
            </h1>
          </div>
          <div className="header-actions">
            {isAdmin && (
              <button
                type="button"
                className="ghost-pill"
                onClick={() => handleNavigation('/admin/dashboard')}
              >
                Admin Dashboard
              </button>
            )}
            <button
              type="button"
              className="icon-button"
              onClick={() => handleNavigation('/notifications')}
              aria-label="Notifications"
            >
              <FiBell />
              <span className="icon-indicator" />
            </button>
            <div className="avatar-pill" aria-hidden="true">
              <FiUser />
            </div>
          </div>
        </motion.header>

        <motion.section
          className="balance-card"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.45 }}
        >
          <div className="balance-top">
            <div>
              <p className="balance-label">Wallet Balance</p>
              <h2 className="balance-value">${stats.balance.toFixed(2)}</h2>
            </div>
            <button
              type="button"
              className="ghost-pill"
              onClick={() => handleNavigation('/wallet')}
            >
              Wallet
              <FiChevronRight />
            </button>
          </div>
          <div className="balance-bottom">
            <div className="balance-meta">
              <span>Total Earned</span>
              <strong>${stats.totalEarned.toFixed(2)}</strong>
            </div>
            <button
              type="button"
              className="primary-pill"
              onClick={() => handleNavigation('/withdraw')}
            >
              Withdraw
            </button>
          </div>
        </motion.section>

        <motion.section
          className="stats-strip"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {quickStats.map((stat) => {
            const IconComponent = stat.icon
            return (
              <motion.div key={stat.id} className="stat-pill" variants={itemVariants}>
                <div className="stat-pill-icon" style={{ background: stat.gradient }}>
                  <IconComponent size={18} />
                </div>
                <div>
                  <p>{stat.title}</p>
                  <h3>{stat.value}</h3>
                </div>
              </motion.div>
            )
          })}
        </motion.section>

        <motion.section
          className="section-block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="section-head">
            <div>
              <h2>Quick Actions</h2>
              <p>Jump into your most-used tools</p>
            </div>
            <button
              type="button"
              className="link-button"
              onClick={() => handleNavigation('/work')}
            >
              View tasks
              <FiChevronRight />
            </button>
          </div>

          <div className="action-grid">
            {dashboardCards.map((card) => {
              const IconComponent = card.icon
              return (
                <motion.button
                  key={card.id}
                  type="button"
                  className="action-card"
                  onClick={() => handleNavigation(card.path)}
                  whileHover={{ y: -6 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="action-icon" style={{ background: card.gradient }}>
                    <IconComponent size={22} />
                  </div>
                  <div className="action-text">
                    <h3>{card.title}</h3>
                    <p>{card.description}</p>
                  </div>
                  <FiArrowUpRight className="action-arrow" />
                </motion.button>
              )
            })}
          </div>
        </motion.section>

        <motion.div
          className="brand-strip"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          <Logo size="small" />
          <div>
            <p>Team4Stack Ads</p>
            <span>Mobile-first workspace</span>
          </div>
        </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
