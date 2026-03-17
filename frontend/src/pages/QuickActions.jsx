import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiDollarSign, FiUsers, FiBook, FiVolume2, FiBriefcase,
  FiInfo, FiPhone, FiCreditCard, FiAward, FiArrowUpRight, FiChevronLeft
} from 'react-icons/fi'
import './QuickActions.css'

const QuickActions = () => {
  const navigate = useNavigate()

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

  return (
    <div className="quick-actions-page">
      <div className="quick-actions-container">
        <div className="quick-actions-header">
          <button
            type="button"
            className="quick-actions-back"
            onClick={() => navigate('/dashboard')}
          >
            <FiChevronLeft />
            Back to Dashboard
          </button>
          <div>
            <h1>Quick Actions</h1>
            <p>All your tools in one place</p>
          </div>
        </div>

        <div className="quick-actions-grid">
          {dashboardCards.map((card) => {
            const IconComponent = card.icon
            return (
              <motion.button
                key={card.id}
                type="button"
                className="quick-action-card"
                onClick={() => navigate(card.path)}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="quick-action-icon" style={{ background: card.gradient }}>
                  <IconComponent size={22} />
                </div>
                <div className="quick-action-text">
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </div>
                <FiArrowUpRight className="quick-action-arrow" />
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default QuickActions
