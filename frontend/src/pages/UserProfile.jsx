import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  FiCopy, FiRefreshCw, FiBox, FiCreditCard, FiDownload,
  FiUser, FiShield, FiCheckSquare, FiList, FiBookOpen, FiHelpCircle,
  FiInfo, FiPower, FiChevronRight, FiAlertTriangle
} from 'react-icons/fi'
import './UserProfile.css'

const UserProfile = () => {
  const navigate = useNavigate()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [copiedId, setCopiedId] = useState(null)

  // Interactive Feature States
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [showAvatarModal, setShowAvatarModal] = useState(false)

  // System State
  const [avatar, setAvatar] = useState(localStorage.getItem('userAvatar') || null)
  const user = {
    name: localStorage.getItem('userName') || 'Team4Stack Member',
    id: localStorage.getItem('userId') || Math.floor(100000000 + Math.random() * 900000000).toString(),
    balance: localStorage.getItem('walletBalance') || '3.66'
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 800)
  }

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text)
    setCopiedId(type)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const confirmLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    navigate('/login')
  }

  const handleAvatarSelect = (emoji) => {
    localStorage.setItem('userAvatar', emoji)
    setAvatar(emoji)
    setShowAvatarModal(false)
  }

  const emojis = ['🦁', '🦅', '🚀', '👑', '💎', '🦊', '🐯', '🔥', '⚡', '🎮', '🐼', '🦄']

  const menuItems = [
    { icon: <FiUser />, title: "Personal Information", route: '/settings' },
    { icon: <FiShield />, title: "Account Security", route: '/security-permissions' },
    { icon: <FiCheckSquare />, title: "Task Center", route: '/work' },
    { icon: <FiList />, title: "Account History", route: '/account-history' },
    { icon: <FiBookOpen />, title: "Platform Guide", route: '/guide' },
    { icon: <FiHelpCircle />, title: "Help & Support", route: '/support' },
    { icon: <FiInfo />, title: "About Team4Stack", route: '/about' },
    { icon: <FiPower style={{ color: '#ef4444' }} />, title: "Logout", onClick: () => setShowLogoutModal(true) }
  ]

  return (
    <div className="game-profile-wrapper">

      {/* 1. Master Orange Hero Section */}
      <div className="game-hero-section">
        <div className="game-hero-top">

          <div className="hero-user-info">
            <div className="hero-avatar interactive-avatar" onClick={() => setShowAvatarModal(true)}>
              {avatar ? <span style={{ fontSize: '1.8rem', lineHeight: 1 }}>{avatar}</span> : user.name.charAt(0).toUpperCase()}
            </div>
            <div className="hero-user-details">
              <div className="hero-name-row">
                <span className="hero-name">▼ {user.name}</span>
                <button className="icon-btn" onClick={() => handleCopy(user.name, 'name')}>
                  <FiCopy color={copiedId === 'name' ? '#10b981' : '#fff'} />
                </button>
              </div>
              <div className="hero-id-row">
                <span className="hero-id">ID: {user.id}</span>
                <button className="icon-btn" onClick={() => handleCopy(user.id, 'id')}>
                  <FiCopy color={copiedId === 'id' ? '#10b981' : '#fff'} />
                </button>
              </div>
            </div>
          </div>

          <div className="hero-balance-box">
            <div className="balance-amount-row">
              <img src="https://flagcdn.com/w20/pk.png" alt="PK" className="flag-icon" />
              <span className="balance-amount">{user.balance}</span>
              <button className={`refresh-btn ${isRefreshing ? 'spinning' : ''}`} onClick={handleRefresh}>
                <FiRefreshCw />
              </button>
            </div>
          </div>
        </div>

        {/* 2. Team4Stack 3-Action Ribbon */}
        <div className="game-action-ribbon">
          <div className="ribbon-item" onClick={() => navigate('/package-deposit')}>
            <div className="ribbon-icon-box">
              <span className="ribbon-badge badge-dark">NEW</span>
              <FiBox className="ribbon-icon" />
            </div>
            <span>Packages</span>
          </div>

          <div className="ribbon-item" onClick={() => navigate('/wallet')}>
            <div className="ribbon-icon-box">
              <FiCreditCard className="ribbon-icon" />
            </div>
            <span>Wallet</span>
          </div>

          <div className="ribbon-item" onClick={() => navigate('/withdraw')}>
            <div className="ribbon-icon-box">
              <FiDownload className="ribbon-icon" />
            </div>
            <span>Withdraw</span>
          </div>
        </div>
      </div>

      {/* 3. Team4Stack Routing Menu List */}
      <div className="game-menu-list">
        {menuItems.map((item, index) => (
          <motion.div
            key={index}
            className="game-menu-item"
            onClick={() => item.onClick ? item.onClick() : navigate(item.route)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="menu-item-left">
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-title">{item.title}</span>
            </div>
            <div className="menu-item-right">
              <FiChevronRight className="menu-chevron" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modals & Overlays */}
      <AnimatePresence>

        {/* Avatar Selection Modal */}
        {showAvatarModal && (
          <motion.div
            className="feature-modal-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              className="feature-modal-card"
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="modal-headline">Select Your Avatar</h3>
              <p className="modal-subtext">Choose a unique emoji to represent your Team4Stack identity globally.</p>

              <div className="emoji-grid">
                {emojis.map((emoji, idx) => (
                  <button key={idx} className="emoji-btn" onClick={() => handleAvatarSelect(emoji)}>
                    {emoji}
                  </button>
                ))}
              </div>

              <button className="premium-btn modal-cancel-btn w-100" onClick={() => setShowAvatarModal(false)}>
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* Logout Confirmation Modal */}
        {showLogoutModal && (
          <motion.div
            className="feature-modal-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              className="feature-modal-card logout-card"
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="danger-icon-box">
                <FiAlertTriangle />
              </div>
              <h3 className="modal-headline text-white mt-3">Are you totally sure?</h3>
              <p className="modal-subtext">Logging out will terminate your active session entirely. You will need to re-authenticate to view your earnings.</p>

              <div className="modal-action-row">
                <button className="premium-btn outline-cancel-btn" onClick={() => setShowLogoutModal(false)}>
                  Go Back
                </button>
                <button className="premium-btn danger-confirm-btn" onClick={confirmLogout}>
                  Yes, Log Out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  )
}

export default UserProfile
