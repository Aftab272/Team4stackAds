import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiMail, FiPhone, FiUser, FiBriefcase, FiHome, FiClock } from 'react-icons/fi'
import './Page.css'
import './OwnerProfile.css'
import ownerPhoto from '../assets/owner.jpeg'
import botimLogo from '../assets/botim.png'

const OwnerProfile = () => {
  const navigate = useNavigate()

  const owner = {
    name: 'M Aftab Akram',
    email: 'ranaaftabakram@gmail.com',
    phone: '03027434569',
    availability: '24 Hours Available',
    profile: 'Student of Software Engineering, University CUI',
    skills: 'MERN Stack Developer',
    company: 'Team4Stack',
    website: 'www.team4stack.com'
  }

  return (
    <div className="app-page">
      <div className="app-container">
        <div className="back-button-container">
          <button
            type="button"
            className="back-dashboard-button"
            onClick={() => navigate('/dashboard')}
          >
            <FiArrowLeft />
            Back Dashboard
          </button>
        </div>
        <div className="owner-title-box">
          <h2 className="page-title owner-title">Owner Profile</h2>
        </div>

        <div className="page-card owner-card p-4 text-center">
          <div className="owner-photo">
            <img src={ownerPhoto} alt={owner.name} />
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
            <div className="info-row">
              <span>
                <FiClock className="me-2" /> Availability
              </span>
              <strong>{owner.availability}</strong>
            </div>
            <div className="info-row">
              <span>
                <FiUser className="me-2" /> Profile
              </span>
              <strong>{owner.profile}</strong>
            </div>
            <div className="info-row">
              <span>
                <FiBriefcase className="me-2" /> Skills
              </span>
              <strong>{owner.skills}</strong>
            </div>
            <div className="info-row">
              <span>
                <FiUser className="me-2" /> Company
              </span>
              <strong>{owner.company}</strong>
            </div>
            <div className="info-row">
              <span>
                <FiHome className="me-2" /> Website
              </span>
              <strong>{owner.website}</strong>
            </div>
          </div>

          <a
            className="owner-link-card"
            href="https://g.botim.me/invite"
            target="_blank"
            rel="noreferrer"
          >
            <img src={botimLogo} alt="Botim" />
            <div>
              <h4>Download Botim</h4>
              <p>Make free phone calls or message us for any query.</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}

export default OwnerProfile
