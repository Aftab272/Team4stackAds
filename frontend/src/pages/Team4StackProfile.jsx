import React from 'react'
import { FiPhone, FiMail, FiBriefcase, FiUser, FiHome } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import './Team4StackProfile.css'

const Team4StackProfile = () => {
  const navigate = useNavigate()

  return (
    <div className="team4stack-page">
      <div className="team4stack-page-container">
        <div className="team4stack-page-header">
          <div>
            <p className="team4stack-page-kicker">Company Profile</p>
            <h1 className="team4stack-page-title">Team4Stack</h1>
          </div>
          <button
            type="button"
            className="team4stack-page-back"
            onClick={() => navigate('/dashboard')}
          >
            <FiHome />
            Back to Dashboard
          </button>
        </div>

        <div className="team4stack-hero">
          <h2>MERN Stack Developer Team</h2>
          <p>
            Student of Software Engineering, CUI. We build modern web apps with
            React, Node.js, Express, and MongoDB.
          </p>
        </div>

        <div className="team4stack-info-grid">
          <div className="team4stack-info-card">
            <FiPhone />
            <div>
              <span>Phone</span>
              <strong>03027334569</strong>
            </div>
          </div>
          <div className="team4stack-info-card">
            <FiMail />
            <div>
              <span>Email</span>
              <strong>ranaaftabakram982@gmail.com</strong>
            </div>
          </div>
          <div className="team4stack-info-card">
            <FiBriefcase />
            <div>
              <span>Profession</span>
              <strong>MERN Stack Developer</strong>
            </div>
          </div>
          <div className="team4stack-info-card">
            <FiUser />
            <div>
              <span>Profile</span>
              <strong>Student of Software Engineering, CUI</strong>
            </div>
          </div>
        </div>

        <div className="team4stack-footer">
          <p>Company: Team4Stack</p>
          <p>Website: www.team4stack.com</p>
        </div>
      </div>
    </div>
  )
}

export default Team4StackProfile
