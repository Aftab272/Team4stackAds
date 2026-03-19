import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiActivity, FiClock } from 'react-icons/fi'
import './AccountHistory.css'

const AccountHistory = () => {
  const navigate = useNavigate()

  // Mocked activity data for premium UI demonstration
  const mockHistory = [
    { id: 1, type: 'login', title: 'System Login', time: '2 hours ago', status: 'Success' },
    { id: 2, type: 'task', title: 'Task Completed (#7482)', time: '5 hours ago', status: 'Completed', amount: '+ Rs. 15.00' },
    { id: 3, type: 'withdraw', title: 'Withdrawal Request', time: '1 day ago', status: 'Processing', amount: '- Rs. 500.00' },
    { id: 4, type: 'package', title: 'Package Upgrade (Pro)', time: '3 days ago', status: 'Active' },
  ]

  return (
    <div className="app-page dark-profile-theme">
      <div className="app-container history-container pb-5">

        {/* Header Ribbon */}
        <div className="subpage-header">
          <button className="back-btn" onClick={() => navigate('/profile')}>
            <FiArrowLeft /> Back
          </button>
          <h2 className="subpage-title">Account History</h2>
          <div style={{ width: '60px' }}></div>
        </div>

        <motion.div
          className="history-card"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="history-icon-header">
            <div className="activity-icon-wrapper">
              <FiActivity className="activity-icon" />
            </div>
            <h3>Recent Activity</h3>
            <p>Monitor your account logs natively from the master secure ledger.</p>
          </div>

          <div className="history-list mt-4">
            {mockHistory.map((item, index) => (
              <motion.div
                key={item.id}
                className="history-list-item"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="hist-info">
                  <div className={`hist-icon-box ${item.type}`}>
                    <FiClock />
                  </div>
                  <div className="hist-text">
                    <h5>{item.title}</h5>
                    <p>{item.time}</p>
                  </div>
                </div>
                <div className="hist-status-col">
                  {item.amount && <span className={`hist-amount ${item.type === 'withdraw' ? 'text-red' : 'text-green'}`}>{item.amount}</span>}
                  <span className={`hist-badge badge-${item.status.toLowerCase()}`}>{item.status}</span>
                </div>
              </motion.div>
            ))}
          </div>

        </motion.div>

      </div>
    </div>
  )
}

export default AccountHistory
