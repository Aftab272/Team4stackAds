import React from 'react'
import './Logo.css'
import t4sLogoSvg from '../assets/T4S_Logo/T4S_Logoo.svg'

const Logo = ({ size = 'medium' }) => {
  return (
    <div className={`logo-container logo-${size}`}>
      <div className="logo-circle">
        <div className="logo-wrapper">
          <img className="logo-svg" src={t4sLogoSvg} alt="Team4Stack Ads" />
        </div>
      </div>
    </div>
  )
}

export default Logo
