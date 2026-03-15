import React from 'react'
import { Spinner } from 'react-bootstrap'

const LoadingSpinner = ({ text = 'Loading...', size = 'md' }) => {
  return (
    <div className="loading-spinner-container">
      <Spinner animation="border" variant="primary" size={size} />
      {text && <p className="loading-text mt-3">{text}</p>}
    </div>
  )
}

export default LoadingSpinner
