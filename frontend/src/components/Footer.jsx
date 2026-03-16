import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Footer.css'

const Footer = () => {
  const location = useLocation()
  const navItems = [
    { to: '/dashboard', icon: 'bi-house', label: 'Home' },
    { to: '/notifications', icon: 'bi-bell', label: 'Alerts' },
    { to: '/wallet', icon: 'bi-cash', label: 'Wallet' },
    { to: '/profile', icon: 'bi-person', label: 'Profile' },
    { to: '/owner-profile', icon: 'bi-person-circle', label: 'Owner' }
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
