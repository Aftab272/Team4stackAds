import React from 'react'
import { Navbar as BSNavbar, Nav, Dropdown } from 'react-bootstrap'
import { FiBell, FiUser, FiMenu } from 'react-icons/fi'

const Navbar = ({ onToggleSidebar }) => {
  const adminName = localStorage.getItem('userName') || 'Admin'
  const userRole = localStorage.getItem('userRole') || 'user'

  return (
    <BSNavbar bg="dark" variant="dark" className="admin-navbar">
      <button
        type="button"
        className="sidebar-toggle"
        onClick={onToggleSidebar}
        aria-label="Toggle sidebar"
      >
        <FiMenu size={20} />
      </button>
      <BSNavbar.Brand href="/admin/dashboard">
        {userRole === 'admin' ? '🛡️ Admin Panel' : '👤 User Panel'}
      </BSNavbar.Brand>

      <Nav className="ms-auto align-items-center">
        <Nav.Link className="notification-link">
          <FiBell size={20} />
          <span className="notification-badge">3</span>
        </Nav.Link>

        <Dropdown align="end">
          <Dropdown.Toggle variant="link" className="nav-link dropdown-toggle">
            <FiUser size={20} className="me-1" />
            <span className="admin-user-name">{adminName}</span>
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item href="/admin/settings">Settings</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item
              onClick={() => {
                localStorage.removeItem('token')
                localStorage.removeItem('userRole')
                window.location.href = '/'
              }}
            >
              Logout
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Nav>
    </BSNavbar>
  )
}

export default Navbar
