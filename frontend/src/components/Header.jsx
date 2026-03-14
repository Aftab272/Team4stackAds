import React, { useState } from 'react'
import { Navbar, Nav, Container, Offcanvas } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Logo from './Logo'
import './Header.css'

const Header = () => {
  const [show, setShow] = useState(false)

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="custom-navbar">
      <Container fluid>
        <Navbar.Brand as={Link} to="/dashboard" className="brand-logo">
          <div className="brand-content">
            <Logo size="small" />
            <h2 className="mb-0">Team4StackAds</h2>
          </div>
        </Navbar.Brand>
        
        <Navbar.Toggle 
          aria-controls="offcanvasNavbar" 
          onClick={() => setShow(true)}
        />
        
        <Navbar.Offcanvas
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
          placement="end"
          show={show}
          onHide={() => setShow(false)}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id="offcanvasNavbarLabel">
              Team4StackAds
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="justify-content-end flex-grow-1 pe-3">
              <Nav.Link as={Link} to="/dashboard" onClick={() => setShow(false)}>
                Dashboard
              </Nav.Link>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  )
}

export default Header
