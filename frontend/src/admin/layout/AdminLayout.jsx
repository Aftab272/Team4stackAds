import React from 'react'
import { Container } from 'react-bootstrap'

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-wrapper">
      <Container fluid className="admin-container">
        {children}
      </Container>
    </div>
  )
}

export default AdminLayout
