import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiArrowLeft,
  FiEdit3,
  FiCheck,
  FiX,
  FiMail,
  FiUser,
  FiHash,
  FiCalendar
} from 'react-icons/fi'
import './Page.css'

const UserProfile = () => {
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)

  const [user, setUser] = useState({
    name: 'Demo User',
    email: 'demo@example.com',
    referralCode: 'DEMO123',
    memberSince: '14/03/2026'
  })

  const handleSave = () => {
    setIsEditing(false)
    alert('Profile updated successfully!')
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="app-page">
      <div className="app-container">
        <div className="page-header">
          <div className="page-header-top">
            <button type="button" className="pill-button" onClick={() => navigate('/dashboard')}>
              <FiArrowLeft />
              Back
            </button>
            {!isEditing && (
              <button type="button" className="pill-button" onClick={() => setIsEditing(true)}>
                <FiEdit3 />
                Edit
              </button>
            )}
          </div>
          <div>
            <h2 className="page-title">{user.name}</h2>
            <p className="page-subtitle">Manage your account information</p>
          </div>
        </div>

        <div className="page-card p-4">
          <div className="text-center mb-4">
            <div
              className="stat-icon"
              style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', margin: '0 auto' }}
            >
              <FiUser size={22} />
            </div>
          </div>

          <div className="info-list">
            <div className="form-field">
              <label><FiUser className="me-2" /> Name</label>
              {isEditing ? (
                <input
                  className="form-input"
                  type="text"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                />
              ) : (
                <strong>{user.name}</strong>
              )}
            </div>

            <div className="form-field">
              <label><FiMail className="me-2" /> Email</label>
              {isEditing ? (
                <input
                  className="form-input"
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                />
              ) : (
                <strong>{user.email}</strong>
              )}
            </div>

            <div className="form-field">
              <label><FiHash className="me-2" /> Referral Code</label>
              <strong>{user.referralCode}</strong>
            </div>

            <div className="form-field">
              <label><FiCalendar className="me-2" /> Member Since</label>
              <strong>{user.memberSince}</strong>
            </div>
          </div>

          <div className="d-flex gap-2 justify-content-center mt-4 flex-wrap">
            {isEditing ? (
              <>
                <button type="button" className="primary-pill" onClick={handleSave}>
                  <FiCheck className="me-2" />
                  Save Changes
                </button>
                <button type="button" className="ghost-pill" onClick={handleCancel}>
                  <FiX className="me-2" />
                  Cancel
                </button>
              </>
            ) : (
              <button type="button" className="ghost-pill" onClick={() => navigate('/dashboard')}>
                Back to Dashboard
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile
