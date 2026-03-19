import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Footer.css'

const Footer = () => {
  const location = useLocation()

  // Re-ordered and updated with Packages before Profile, using -fill icons for richer look
  const navItems = [
    { to: '/dashboard', icon: 'bi-house-fill', label: 'Home' },
    { to: '/notifications', icon: 'bi-bell-fill', label: 'Alerts' },
    { to: '/wallet', icon: 'bi-wallet-fill', label: 'Wallet' },
    { to: '/package-deposit', icon: 'bi-box-seam-fill', label: 'Packages' },
    { to: '/profile', icon: 'bi-person-fill', label: 'Profile' },
  ]

  return (
    <footer className="footer">
      <div className="footer-icons">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`footer-link ${location.pathname === item.to ? 'active' : ''}`}
            aria-label={item.label}
          >
            <i className={`bi ${item.icon}`}></i>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </footer>
  )
}

export default Footer
