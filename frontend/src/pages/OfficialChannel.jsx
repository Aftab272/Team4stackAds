import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiVolume2, FiBell, FiAlertCircle } from 'react-icons/fi'
import api from '../services/api'
import { showError } from '../services/notify'
import './OfficialChannel.css'
import communityImg from '../assets/community.webp'
import offersImg from '../assets/offers.png'

const OfficialChannel = () => {
  const navigate = useNavigate()
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      const response = await api.get('/announcements')
      setAnnouncements(response.data.announcements || [])
    } catch (error) {
      console.log("Mock routing tracking visuals exclusively.")
    } finally {
      setLoading(false)
    }
  }

  const appLinks = [
    {
      name: 'WhatsApp',
      href: 'https://wa.me/923027434569',
      gradient: 'linear-gradient(135deg, #128C7E 0%, #075E54 100%)',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg',
      desc: 'Instant Support & Live Help'
    },
    {
      name: 'Telegram',
      href: 'https://t.me/yourchannel',
      gradient: 'linear-gradient(135deg, #0088cc 0%, #005f8f 100%)',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg',
      desc: 'Official App Updates'
    },
    {
      name: 'Botim',
      href: 'https://g.botim.me/invite',
      gradient: 'linear-gradient(135deg, #0f172a 0%, #000000 100%)',
      logo: 'https://cdn-icons-png.flaticon.com/512/5968/5968920.png',
      desc: 'Secure Network Line'
    }
  ]

  return (
    <div className="app-page dark-profile-theme">
      <div className="app-container pb-5">

        {/* Header Strip */}
        <div className="subpage-header mb-4">
          <button className="back-btn" onClick={() => navigate('/quick-actions')}>
            <FiArrowLeft /> Back
          </button>
          <h2 className="subpage-title">Broadcast Networks</h2>
          <div style={{ width: '60px' }}></div>
        </div>

        {/* Premium Connectivity Grid */}
        <div className="channel-top-flex mb-5">
          <motion.div className="channel-info-box" initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}>
            <div className="channel-icon-top"><FiVolume2 /></div>
            <h3>Connect Instantly</h3>
            <p>Access our encrypted and public routing nodes bridging immediate resolutions safely globally.</p>
          </motion.div>

          <div className="channel-links-grid">
            {appLinks.map((app, idx) => (
              <motion.a
                key={app.name} href={app.href} target="_blank" rel="noreferrer"
                className="social-bridge-card"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 * idx }}
                style={{ background: app.gradient }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <img src={app.logo} alt={app.name} className="bridge-logo" />
                <div className="bridge-text">
                  <h4>{app.name}</h4>
                  <p>{app.desc}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </div>

        {/* Graphic Hubs */}
        <div className="graphics-hub-grid mb-5">
          <motion.a href="https://whatsapp.com/channel/0029VbCVtZ7Id7nSBLYXOQ1c" target="_blank" rel="noreferrer"
            className="graphic-link-card"
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
          >
            <img src={communityImg} alt="Community Hub" className="graphic-bg" />
            <div className="graphic-overlay">
              <h4>Community Link</h4>
            </div>
          </motion.a>

          <motion.a href="https://whatsapp.com/channel/0029VbCVtZ7Id7nSBLYXOQ1c" target="_blank" rel="noreferrer"
            className="graphic-link-card"
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          >
            <img src={offersImg} alt="Offers Hub" className="graphic-bg" style={{ objectFit: 'contain', background: '#fff' }} />
            <div className="graphic-overlay">
              <h4>Active Offers</h4>
            </div>
          </motion.a>
        </div>

        {/* Native Announcements Board */}
        <motion.div className="announcements-wrapper" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <h3 className="section-label mb-3">System Broadcasting</h3>

          <div className="announcement-list">
            {loading ? (
              <div className="salary-empty-state"><span className="pulsing-loader"></span></div>
            ) : announcements.length === 0 ? (
              <div className="salary-empty-state">
                <FiBell className="empty-icon" />
                <h4>All Clear</h4>
                <p>There are no urgent transmissions circulating on the network currently.</p>
              </div>
            ) : (
              announcements.map((msg, idx) => (
                <motion.div key={msg.id} className="announcement-card mb-3" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * idx }}>
                  <div className="announce-header">
                    <h4 className="announce-title">
                      {msg.is_important && <FiAlertCircle className="text-danger me-2" />}
                      {msg.title}
                    </h4>
                    <span className="announce-date">{new Date(msg.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="announce-body">{msg.content}</p>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

      </div>
    </div>
  )
}

export default OfficialChannel
