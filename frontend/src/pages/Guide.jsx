import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiCheckCircle } from 'react-icons/fi'
import './Guide.css'

const Guide = () => {
  const navigate = useNavigate()

  const guideSteps = [
    { title: 'Getting Started', content: 'Create your account and complete your profile to start earning instantly on the platform.' },
    { title: 'Complete Tasks', content: 'Visit the Task Center to find available tasks or view ads to begin stacking rewards quickly.' },
    { title: 'Build Your Team', content: 'Share your referral code with friends. Earn deep recursive bonuses securely when they join and complete tasks.' },
    { title: 'Track Earnings', content: 'Monitor your earnings accurately in the Wallet page. See a complete breakdown of your total income drops.' },
    { title: 'Withdraw Funds', content: 'Request verified withdrawals rapidly straight from your wallet balance. Processing pipelines resolve securely.' },
    { title: 'Stay Updated', content: 'Check formatting announcements natively to track ongoing drops or updates globally.' },
  ]

  return (
    <div className="app-page dark-profile-theme">
      <div className="app-container guide-container pb-5">

        {/* Header Ribbon */}
        <div className="subpage-header">
          <button className="back-btn" onClick={() => navigate('/profile')}>
            <FiArrowLeft /> Back
          </button>
          <h2 className="subpage-title">Platform Guide</h2>
          <div style={{ width: '60px' }}></div>
        </div>

        <div className="guide-hero">
          <h1 className="hero-head">Welcome to Team4StackAds</h1>
          <p className="hero-subtext">Master the platform mechanics securely with this comprehensive operational guide.</p>
        </div>

        <div className="guide-grid">
          {guideSteps.map((step, index) => (
            <motion.div
              key={index}
              className="guide-step-card"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="step-number-ring">
                {index + 1}
              </div>
              <div className="step-content-node">
                <h4>{step.title}</h4>
                <p>{step.content}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="guide-tips-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="tips-head">
            <FiCheckCircle className="text-orange" style={{ fontSize: '1.5rem' }} />
            <h4 className="m-0 text-white">Critical Tips for Success</h4>
          </div>
          <ul className="premium-list">
            <li>Complete tasks daily to maximize your compounding earnings.</li>
            <li>Invite friends heavily utilizing your referral network structural tree.</li>
            <li>Monitor the dashboard charts frequently to spot new dynamic features.</li>
            <li>Configure Two-Factor authentication in Security settings absolutely first.</li>
          </ul>
        </motion.div>

      </div>
    </div>
  )
}

export default Guide
