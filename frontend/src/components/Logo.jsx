import React from 'react'
import './Logo.css'

const Logo = ({ size = 'medium' }) => {
  return (
    <div className={`logo-container logo-${size}`}>
      <div className="logo-circle">
        <div className="logo-wrapper">
          {/* T Shape Base - Dark Blue */}
          <div className="logo-t-base"></div>
          
          {/* Top Chevron - Dark Blue */}
          <div className="logo-chevron-top"></div>
          
          {/* Bottom Chevron - Gold/Bronze */}
          <div className="logo-chevron-bottom"></div>
          
          {/* Arrow - Gold/Bronze */}
          <div className="logo-arrow"></div>
        </div>
      </div>
    </div>
  )
}

export default Logo
