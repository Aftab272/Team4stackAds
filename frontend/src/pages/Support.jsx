import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiSend, FiMessageCircle, FiPhoneCall, FiMail } from 'react-icons/fi'
import { Form, Alert } from 'react-bootstrap'
import './Support.css'

const Support = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ subject: '', message: '', priority: 'normal' })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Support request:', formData)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
    setFormData({ subject: '', message: '', priority: 'normal' })
  }

  return (
    <div className="app-page dark-profile-theme">
      <div className="app-container support-container pb-5">

        {/* Header Ribbon */}
        <div className="subpage-header">
          <button className="back-btn" onClick={() => navigate('/profile')}>
            <FiArrowLeft /> Back
          </button>
          <h2 className="subpage-title">Help & Support</h2>
          <div style={{ width: '60px' }}></div>
        </div>

        {submitted && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <Alert variant="success" className="support-alert">
              ✅ Your support request has been submitted securely! Our team will respond shortly.
            </Alert>
          </motion.div>
        )}

        <div className="support-grid">

          <motion.div
            className="support-card form-card"
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="support-card-head mb-4">
              <FiMessageCircle className="head-icon" />
              <div>
                <h3>Submit a Ticket</h3>
                <p>Fill out the form below to reach our dedicated support team directly.</p>
              </div>
            </div>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4">
                <Form.Label className="premium-label">Subject</Form.Label>
                <Form.Control
                  type="text"
                  name="subject"
                  placeholder="Tell us what you need help with"
                  value={formData.subject}
                  onChange={handleChange}
                  className="premium-input"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="premium-label">Priority Level</Form.Label>
                <Form.Select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="premium-input select-input"
                >
                  <option value="low">Low - General Inquiry</option>
                  <option value="normal">Normal - Standard Issue</option>
                  <option value="high">High - Urgent Assistance</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="premium-label">Detailed Message</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  name="message"
                  placeholder="Please describe your issue here..."
                  value={formData.message}
                  onChange={handleChange}
                  className="premium-input text-area"
                  required
                />
              </Form.Group>

              <button type="submit" className="premium-btn primary-btn w-100">
                <FiSend style={{ marginRight: '8px' }} /> Send Message
              </button>
            </Form>
          </motion.div>

          {/* Contact Details Column */}
          <motion.div
            className="support-details-col"
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="support-card detail-card mb-4" style={{ height: '100%', justifyContent: 'center' }}>
              <div className="detail-icon-box"><FiMail /></div>
              <h4>Email Support</h4>
              <p>team4stack@gmail.com</p>
            </div>
          </motion.div>

        </div>

      </div>
    </div>
  )
}

export default Support