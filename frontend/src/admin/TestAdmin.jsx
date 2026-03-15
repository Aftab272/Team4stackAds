import React from 'react'

function TestAdmin() {
  return (
    <div style={{ padding: '40px', color: 'white' }}>
      <h1>✅ Admin Panel Test</h1>
      <p>If you can see this, the admin setup is working!</p>
      <button 
        onClick={() => alert('Button works!')}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        Test Button
      </button>
    </div>
  )
}

export default TestAdmin
