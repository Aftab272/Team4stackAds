import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiTarget, FiGlobe, FiAward } from 'react-icons/fi'
import './AboutUs.css'

const AboutUs = () => {
  const navigate = useNavigate()

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="app-page dark-profile-theme">
      <div className="app-container about-container pb-5">

        {/* Header Ribbon */}
        <div className="subpage-header">
          <button className="back-btn" onClick={() => navigate('/profile')}>
            <FiArrowLeft /> Back
          </button>
          <div style={{ width: '60px' }}></div>
        </div>

        <div className="about-hero">
          <div className="hero-gradient-text">Team4StackAds</div>
          <p className="about-subtitle">Pioneering transparent rewards and global user empowerment.</p>
        </div>

        <motion.div
          className="about-card main-mission-card mb-5"
          initial="hidden" animate="visible" variants={cardVariants}
        >
          <h2>Who We Are</h2>
          <p>
            We are deeply committed to bridging the gap between talent and opportunity. Team4StackAds is designed from the ground up to create a fair, highly transparent ecosystem allowing users universally to earn heavily through completing tasks and structuring strong network teams. We believe raw dedication deserves unparalleled rewards.
          </p>
        </motion.div>

        <div className="about-grid">

          <motion.div
            className="about-card value-card"
            initial="hidden" animate="visible" variants={cardVariants} transition={{ delay: 0.1 }}
          >
            <div className="value-icon"><FiTarget /></div>
            <h3>Our Mission</h3>
            <p>To construct a limitless platform where anyone can scale their earnings continuously by contributing specific skills and maintaining a dynamic, tight-knit community network.</p>
          </motion.div>

          <motion.div
            className="about-card value-card"
            initial="hidden" animate="visible" variants={cardVariants} transition={{ delay: 0.2 }}
          >
            <div className="value-icon"><FiGlobe /></div>
            <h3>Our Vision</h3>
            <p>To be universally recognized as the absolute highest-trust, highest-reward platform globally for rapid task resolution and exponential team building algorithms.</p>
          </motion.div>

          <motion.div
            className="about-card value-card"
            initial="hidden" animate="visible" variants={cardVariants} transition={{ delay: 0.3 }}
          >
            <div className="value-icon"><FiAward /></div>
            <h3>Core Values</h3>
            <p>Absolute transparency structurally. We rigorously enforce fair payouts and obsess heavily over generating the best possible frictionless user flow in the industry.</p>
          </motion.div>

        </div>

      </div>
    </div>
  )
}

export default AboutUs
