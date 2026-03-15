import React from 'react'
import { Nav } from 'react-bootstrap'
import { useNavigate, useLocation } from 'react-router-dom'
import { FiHome, FiUsers, FiDollarSign, FiCheckSquare, FiWallet, FiMegaphone, FiBarChart, FiLogOut } from 'react-icons/fi'

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    { path: '/admin/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/admin/users', icon: FiUsers, label: 'Users' },
    { path: '/admin/withdraw-requests', icon: FiDollarSign, label: 'Withdrawals' },
    { path: '/admin/tasks', icon: FiCheckSquare, label: 'Tasks' },
    { path: '/admin/wallet', icon: FiWallet, label: 'Wallet' },
    { path: '/admin/announcements', icon: FiMegaphone, label: 'Announcements' },
    { path: '/admin/reports', icon: FiBarChart, label: 'Reports' },
  ]

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Admin Dashboard</h3>
        <p>Team4StackAds</p>
      </div>
      
      <Nav className="flex-column">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Nav.Link
              key={item.path}
              className={location.pathname === item.path ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault()
                navigate(item.path)
              }}
            >
              <Icon className="me-2" />
              {item.label}
            </Nav.Link>
          )
        })}
      </Nav>

      <div className="sidebar-footer">
        <Nav.Link onClick={() => {
          localStorage.removeItem('token')
          localStorage.removeItem('userRole')
          navigate('/')
        }}>
          <FiLogOut className="me-2" />
          Logout
        </Nav.Link>
      </div>
    </div>
  )
}

export default Sidebar
