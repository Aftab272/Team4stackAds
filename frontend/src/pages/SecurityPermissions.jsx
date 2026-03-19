import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiLock, FiShield, FiSmartphone, FiKey } from 'react-icons/fi'
import './SecurityPermissions.css'

const SecurityPermissions = () => {
  const navigate = useNavigate()
  const [twoFactorSelected, setTwoFactorSelected] = useState(false)

  const handleToggle2FA = () => {
    setTwoFactorSelected(!twoFactorSelected)
  }

  return (
    <div className="app-page dark-profile-theme">
      <div className="app-container security-container pb-5">

        {/* Header Ribbon */}
        <div className="subpage-header">
          <button className="back-btn" onClick={() => navigate('/profile')}>
            <FiArrowLeft /> Back
          </button>
          <h2 className="subpage-title">Account Security</h2>
          <div style={{ width: '60px' }}></div>
        </div>

        <motion.div
          className="security-card"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="security-icon-header">
            <div className="shield-icon-wrapper">
              <FiShield className="shield-icon" />
            </div>
            <h3>Master Security Center</h3>
            <p>Your Team4Stack account is encrypted and protected. Manage parameters below.</p>
          </div>

          <div className="security-section">
            <div className="sec-info">
              <div className="sec-icon-box yellow-box"><FiKey /></div>
              <div className="sec-text">
                <h5>Password Management</h5>
                <p>Last changed 30 days ago</p>
              </div>
            </div>
            <button className="premium-btn outline-orange-btn">Update</button>
          </div>

          <div className="security-section">
            <div className="sec-info">
              <div className="sec-icon-box green-box"><FiSmartphone /></div>
              <div className="sec-text">
                <h5>Two-Factor Authentication</h5>
                <p>Protect account with mobile OTP codes.</p>
              </div>
            </div>
            <div className={`premium-toggle ${twoFactorSelected ? 'active-neon' : ''}`} onClick={handleToggle2FA}>
              <div className="toggle-knob"></div>
            </div>
          </div>

          <div className="security-section" style={{ borderBottom: 'none' }}>
            <div className="sec-info">
              <div className="sec-icon-box red-box"><FiLock /></div>
              <div className="sec-text">
                <h5>Active Sessions</h5>
                <p>You are logged in on 1 device.</p>
              </div>
            </div>
            <button className="premium-btn text-muted-btn">Manage</button>
          </div>

        </motion.div>

      </div>
    </div>
  )
}

export default SecurityPermissions
