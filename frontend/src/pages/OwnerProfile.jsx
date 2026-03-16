import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiMail, FiPhone, FiUser } from 'react-icons/fi'
import './Page.css'

const OwnerProfile = () => {
  const navigate = useNavigate()

  const owner = {
    name: 'M Aftab Akram',
    email: 'ranaaftabakram9@gmail.com',
    phone: '03027434569'
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
          </div>
          <div>
            <h2 className="page-title">Owner Profile</h2>
            <p className="page-subtitle">Owner information and contact details</p>
          </div>
        </div>

        <div className="page-card p-4 text-center">
          <div
            className="stat-icon mb-3"
            style={{
              background: 'linear-gradient(135deg, #0ea5a4 0%, #38bdf8 100%)',
              margin: '0 auto'
            }}
          >
            <FiUser size={22} />
          </div>
          <h3 className="mb-1 text-white">{owner.name}</h3>
          <p className="page-subtitle mb-4">Application Owner</p>

          <div className="info-list">
            <div className="info-row">
              <span>
                <FiMail className="me-2" /> Email
              </span>
              <strong>{owner.email}</strong>
            </div>
            <div className="info-row">
              <span>
                <FiPhone className="me-2" /> Phone
              </span>
              <strong>{owner.phone}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OwnerProfile
