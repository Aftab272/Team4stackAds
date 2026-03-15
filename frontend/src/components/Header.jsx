import React, { useState } from 'react'
import { Navbar, Nav, Container, Offcanvas, Button } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { FiMenu, FiX, FiHome, FiUser, FiSettings, FiHelpCircle } from 'react-icons/fi'
import Logo from './Logo'
import './Header.css'

const Header = () => {
  const [show, setShow] = useState(false)
  const navigate = useNavigate()
  const userName = localStorage.getItem('userName') || 'User'

  return (
    <Navbar expand="lg" className="modern-header">
      <Container fluid>
        <Navbar.Brand as={Link} to="/dashboard" className="brand-logo">
          <div className="brand-content">
            <Logo size="small" />
            <div className="brand-text">
              <h2 className="brand-title">Team4Stack</h2>
              <p className="brand-subtitle">Ads Platform</p>
            </div>
          </div>
        </Navbar.Brand>
        
        <div className="header-actions">
          <div className="user-badge">
            <span className="user-greeting">Hi, {userName}</span>
          </div>
          <Navbar.Toggle 
            aria-controls="offcanvasNavbar" 
            onClick={() => setShow(true)}
            className="menu-toggle"
          >
            <FiMenu size={24} />
          </Navbar.Toggle>
        </div>
        
        <Navbar.Offcanvas
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
          placement="end"
          show={show}
          onHide={() => setShow(false)}
          className="modern-offcanvas"
        >
          <Offcanvas.Header className="offcanvas-header-custom">
            <Offcanvas.Title id="offcanvasNavbarLabel" className="offcanvas-title">
              <Logo size="medium" />
              <h3>Team4Stack</h3>
            </Offcanvas.Title>
            <Button variant="link" onClick={() => setShow(false)} className="close-btn">
              <FiX size={24} />
            </Button>
          </Offcanvas.Header>
          <Offcanvas.Body className="offcanvas-body-custom">
            <Nav className="flex-column">
              <Nav.Link as={Link} to="/dashboard" onClick={() => setShow(false)} className="offcanvas-link">
                <FiHome className="link-icon" />
                <span>Dashboard</span>
              </Nav.Link>
              <Nav.Link as={Link} to="/profile" onClick={() => setShow(false)} className="offcanvas-link">
                <FiUser className="link-icon" />
                <span>Profile</span>
              </Nav.Link>
              <Nav.Link as={Link} to="/settings" onClick={() => setShow(false)} className="offcanvas-link">
                <FiSettings className="link-icon" />
                <span>Settings</span>
              </Nav.Link>
              <Nav.Link as={Link} to="/support" onClick={() => setShow(false)} className="offcanvas-link">
                <FiHelpCircle className="link-icon" />
                <span>Support</span>
              </Nav.Link>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  )
}

export default Header
