import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-icons">
        <Link to="/dashboard" className="footer-link">
          <i className="bi bi-house"></i>
        </Link>
        <Link to="/notifications" className="footer-link">
          <i className="bi bi-bell"></i>
        </Link>
        <Link to="/wallet" className="footer-link">
          <i className="bi bi-cash"></i>
        </Link>
        <Link to="/profile" className="footer-link">
          <i className="bi bi-person"></i>
        </Link>
        <Link to="/owner-profile" className="footer-link">
          <i className="bi bi-person-circle"></i>
        </Link>
      </div>
    </footer>
  )
}

export default Footer