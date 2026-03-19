import React, { useState } from 'react'
import { Container, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiSave, FiLogOut } from 'react-icons/fi'
import './Settings.css'

const Settings = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: localStorage.getItem('userName') || 'Team4Stack Member',
    email: localStorage.getItem('userEmail') || 'user@team4stack.com',
    notifications: true,
    language: 'English'
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleToggle = () => {
    setFormData({ ...formData, notifications: !formData.notifications })
  }

  const handleSaveChanges = (e) => {
    e.preventDefault()
    // Trigger save
    alert('Settings successfully updated!')
  }

  return (
    <div className="app-page dark-profile-theme">
      <div className="app-container settings-container pb-5">

        {/* Header Ribbon */}
        <div className="subpage-header">
          <button className="back-btn" onClick={() => navigate('/profile')}>
            <FiArrowLeft /> Back
          </button>
          <h2 className="subpage-title">Personal Information</h2>
          <div style={{ width: '60px' }}></div> {/* Spacer for alignment */}
        </div>

        <motion.div
          className="settings-card"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Form onSubmit={handleSaveChanges}>
            <div className="settings-section">
              <h5 className="section-title">Account Details</h5>

              <Form.Group className="mb-4">
                <Form.Label className="premium-label">Full Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="premium-input"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="premium-label">Email Address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  readOnly
                  className="premium-input read-only"
                />
                <Form.Text className="text-muted" style={{ opacity: 0.6 }}>
                  Email addresses cannot be changed directly for security purposes.
                </Form.Text>
              </Form.Group>
            </div>

            <div className="settings-section">
              <h5 className="section-title">Preferences</h5>

              <div className="premium-toggle-row">
                <div className="toggle-info">
                  <span className="toggle-label">Email Notifications</span>
                  <span className="toggle-desc">Receive updates on tasks and withdrawals.</span>
                </div>
                <div className={`premium-toggle ${formData.notifications ? 'active' : ''}`} onClick={handleToggle}>
                  <div className="toggle-knob"></div>
                </div>
              </div>

              <Form.Group className="mt-4">
                <Form.Label className="premium-label">Language / Region</Form.Label>
                <Form.Select
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="premium-input select-input"
                >
                  <option>English</option>
                  <option>Urdu</option>
                  <option>Hindi</option>
                </Form.Select>
              </Form.Group>
            </div>

            <div className="settings-action-row">
              <button type="submit" className="premium-btn primary-btn">
                <FiSave style={{ marginRight: '8px' }} /> Save Changes
              </button>
            </div>
          </Form>
        </motion.div>

      </div>
    </div>
  )
}

export default Settings
