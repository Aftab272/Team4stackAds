import React from 'react'
import { Nav } from 'react-bootstrap'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  FiHome,
  FiUsers,
  FiDollarSign,
  FiCheckSquare,
  FiCreditCard,
  FiBell,
  FiBarChart,
  FiLogOut,
  FiSettings,
  FiShield,
  FiUser,
  FiLayers,
  FiPlay,
  FiShoppingBag
} from 'react-icons/fi'
import t4sLogoSvg from '../../assets/T4S_Logo/T4S_Logoo.svg'

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const userRole = localStorage.getItem('userRole') || 'user'

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    navigate('/')
    if (onClose) onClose()
  }

  const primaryAdminItems = [
    { path: '/admin/dashboard', icon: FiShield, label: 'Admin Dashboard' },
    { path: '/dashboard', icon: FiHome, label: 'User Dashboard' },
    { path: '/settings', icon: FiSettings, label: 'Settings' },
  ]

  // Admin menu items
  const adminMenuItems = [
    { path: '/admin/users', icon: FiUsers, label: 'Users' },
    { path: '/admin/memberships', icon: FiLayers, label: 'Memberships' },
    { path: '/admin/payments', icon: FiShoppingBag, label: 'Payments' },
    { path: '/admin/ads', icon: FiPlay, label: 'Ads' },
    { path: '/admin/withdraw-requests', icon: FiDollarSign, label: 'Withdrawals' },
    { path: '/admin/tasks', icon: FiCheckSquare, label: 'Tasks' },
    { path: '/admin/wallet', icon: FiCreditCard, label: 'Wallet' },
    { path: '/admin/announcements', icon: FiBell, label: 'Announcements' },
    { path: '/admin/reports', icon: FiBarChart, label: 'Reports' },
  ]

  // User menu items
  const userMenuItems = [
    { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/profile', icon: FiUser, label: 'Profile' },
    { path: '/wallet', icon: FiCreditCard, label: 'Wallet' },
    { path: '/team', icon: FiUsers, label: 'Team' },
    { path: '/work', icon: FiCheckSquare, label: 'Work' },
    { path: '/salary', icon: FiDollarSign, label: 'Salary' },
  ]

  return (
    <div className={`sidebar ${isOpen ? 'active' : ''}`}>
      {/* Header */}
      <div className="sidebar-header">
        <img src={t4sLogoSvg} alt="Team4Stack Ads" className="sidebar-logo" />
        <h3>Team4StackAds</h3>
        <p>{userRole === 'admin' ? 'Admin Panel' : 'User Panel'}</p>
      </div>

      {/* Admin Panel Section */}
      {userRole === 'admin' && (
        <>
          <div className="panel-section">
            <div className="panel-label">PRIMARY</div>
            <Nav className="flex-column">
              {primaryAdminItems.map((item) => {
                const Icon = item.icon
                return (
                  <Nav.Link
                    key={item.path}
                    className={location.pathname === item.path ? 'active' : ''}
                    onClick={(e) => {
                      e.preventDefault()
                      navigate(item.path)
                      if (onClose) onClose()
                    }}
                  >
                    <Icon className="me-2" />
                    {item.label}
                  </Nav.Link>
                )
              })}
              <Nav.Link
                onClick={(e) => {
                  e.preventDefault()
                  handleLogout()
                }}
                className="logout-link"
              >
                <FiLogOut className="me-2" />
                Logout
              </Nav.Link>
            </Nav>
          </div>

          {/* Divider */}
          <div className="sidebar-divider"></div>

          <div className="panel-section">
            <div className="panel-label">ADMIN PANEL</div>
            <Nav className="flex-column">
              {adminMenuItems.map((item) => {
                const Icon = item.icon
                return (
                  <Nav.Link
                    key={item.path}
                    className={location.pathname === item.path ? 'active' : ''}
                    onClick={(e) => {
                      e.preventDefault()
                      navigate(item.path)
                      if (onClose) onClose()
                    }}
                  >
                    <Icon className="me-2" />
                    {item.label}
                  </Nav.Link>
                )
              })}
            </Nav>
          </div>

          {/* Divider */}
          <div className="sidebar-divider"></div>

          {/* User Panel Section (Admin can access both) */}
          <div className="panel-section">
            <div className="panel-label">USER PANEL</div>
            <Nav className="flex-column">
              {userMenuItems.map((item) => {
                const Icon = item.icon
                return (
                  <Nav.Link
                    key={item.path}
                    className={location.pathname === item.path ? 'active' : ''}
                    onClick={(e) => {
                      e.preventDefault()
                      navigate(item.path)
                      if (onClose) onClose()
                    }}
                  >
                    <Icon className="me-2" />
                    {item.label}
                  </Nav.Link>
                )
              })}
            </Nav>
          </div>
        </>
      )}

      {/* User Panel Section (For regular users only) */}
      {userRole !== 'admin' && (
        <Nav className="flex-column">
          {userMenuItems.map((item) => {
            const Icon = item.icon
            return (
            <Nav.Link
              key={item.path}
              className={location.pathname === item.path ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault()
                navigate(item.path)
                if (onClose) onClose()
              }}
            >
                <Icon className="me-2" />
                {item.label}
              </Nav.Link>
            )
          })}
        </Nav>
      )}

      {/* Logout Button */}
      <div className="sidebar-footer">
        <Nav.Link
          onClick={handleLogout}
          className="logout-link"
        >
          <FiLogOut className="me-2" />
          Logout
        </Nav.Link>
      </div>
    </div>
  )
}

export default Sidebar
