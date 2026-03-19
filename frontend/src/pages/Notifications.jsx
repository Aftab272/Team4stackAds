import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiBell } from 'react-icons/fi'
import './Page.css'
import './Notifications.css'

const Notifications = () => {
  const navigate = useNavigate()

  const notifications = [
    {
      id: 1,
      title: 'System Update',
      message: 'The system will be down for maintenance between 02:00-03:00 AM.',
      time: 'Just now',
      emoji: '⚙️'
    },
    {
      id: 2,
      title: 'New Feature',
      message: 'You can now track withdrawals directly from the dashboard.',
      time: '1 hour ago',
      emoji: '✨'
    },
    {
      id: 3,
      title: 'Reminder',
      message: "Don't forget to verify your email to secure your account.",
      time: 'Yesterday',
      emoji: '🔔'
    }
  ]

  return (
    <div className="app-page">
      <div className="app-container">
        <div className="back-button-container">
          <button
            type="button"
            className="back-dashboard-button"
            onClick={() => navigate('/dashboard')}
          >
            <FiArrowLeft />
            Back Dashboard
          </button>
        </div>
        <div className="notification-title-box">
          <h2 className="page-title notification-title">Notifications</h2>
        </div>

        <div className="page-card notification-card p-4">
          <div className="d-flex align-items-center gap-2 mb-3">
            <FiBell />
            <h3 className="m-0 text-white">Recent Alerts</h3>
          </div>

          <div className="list-card">
            {notifications.map((note) => (
              <div key={note.id} className="list-item">
                <div className="transaction-row">
                  <div>
                    <div className="notification-title-row">
                      <span className="notification-emoji">
                        {note.emoji}
                      </span>
                      <h4>{note.title}</h4>
                    </div>
                    <p>{note.message}</p>
                  </div>
                  <span className="page-subtitle">{note.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Notifications
