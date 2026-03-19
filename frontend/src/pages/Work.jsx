import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiCheckCircle, FiPlayCircle, FiBox, FiCheckSquare } from 'react-icons/fi'
import api from '../services/api'
import { showError } from '../services/notify'
import './Work.css'

const Work = () => {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState([])
  const [packages, setPackages] = useState([])
  const [ads, setAds] = useState([])
  const [adsInfo, setAdsInfo] = useState({ remainingToday: 0, membership: null })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTasks()
    fetchPackages()
    fetchAds()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks')
      setTasks(response.data.tasks || [])
    } catch (error) {
      console.log('Task fetch mock running for standalone testing.', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPackages = async () => {
    try {
      const response = await api.get('/memberships')
      setPackages(response.data.memberships || [])
    } catch (error) {
      console.log('Membership fetch mock running.')
    }
  }

  const fetchAds = async () => {
    try {
      const response = await api.get('/ads')
      setAds(response.data.ads || [])
      setAdsInfo({
        remainingToday: response.data.remainingToday || 0,
        membership: response.data.membership || null
      })
    } catch (error) {
      console.log('Ads fetch mock running.')
    }
  }

  const handleCompleteTask = async (taskId) => {
    try {
      await api.post(`/tasks/${taskId}/complete`)
      fetchTasks()
    } catch (error) {
      console.error(error)
    }
  }

  const handleCompleteAd = async (ad) => {
    try {
      if (ad.url) {
        window.open(ad.url, '_blank', 'noopener')
      }
      await api.post(`/ads/${ad.id}/complete`)
      fetchAds()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="app-page dark-profile-theme">
      <div className="app-container work-container pb-5">

        {/* Header Ribbon */}
        <div className="subpage-header">
          {/* Routes back to profile naturally for app consistency from the list menu */}
          <button className="back-btn" onClick={() => navigate('/profile')}>
            <FiArrowLeft /> Back
          </button>
          <h2 className="subpage-title">Task Center</h2>
          <div style={{ width: '60px' }}></div>
        </div>

        {/* Ads Section */}
        <div className="work-section">
          <div className="section-head">
            <h3><FiPlayCircle className="text-orange" /> Available Ads</h3>
            <span className="status-tag">
              {adsInfo.membership ? `${adsInfo.remainingToday} Remaining Today` : 'Membership Required'}
            </span>
          </div>

          <div className="work-grid">
            {ads.length === 0 ? (
              <div className="empty-state-card">
                <FiPlayCircle className="empty-icon" />
                <p>No ads available to watch at the moment.</p>
              </div>
            ) : (
              ads.map((ad, idx) => (
                <motion.div
                  key={ad.id}
                  className="premium-task-card"
                  initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                >
                  <div className="task-card-head">
                    <h4>{ad.title}</h4>
                    <div className={`status-badge ${ad.status === 'completed' ? 'badge-completed' : 'badge-active'}`}>
                      {ad.status === 'completed' ? 'Completed' : 'Available'}
                    </div>
                  </div>
                  <p className="task-desc">{ad.description || 'Watch to claim reward.'}</p>
                  <div className="task-action-row">
                    <span className="task-reward">Rs. {ad.reward_amount}</span>
                    {ad.status !== 'completed' && (
                      <button className="premium-btn primary-btn small-btn" onClick={() => handleCompleteAd(ad)}>
                        Claim Reward
                      </button>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Tasks Section */}
        <div className="work-section mt-5">
          <div className="section-head">
            <h3><FiCheckSquare className="text-orange" /> Daily Tasks</h3>
          </div>

          <div className="work-grid">
            {tasks.length === 0 ? (
              <div className="empty-state-card">
                <FiCheckCircle className="empty-icon" />
                <p>All daily tasks completed! Great job.</p>
              </div>
            ) : (
              tasks.map((task, idx) => (
                <motion.div
                  key={task.id}
                  className="premium-task-card"
                  initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                >
                  <div className="task-card-head">
                    <h4>{task.title}</h4>
                    <div className={`status-badge ${task.status === 'completed' ? 'badge-completed' : 'badge-active'}`}>
                      {task.status === 'completed' ? 'Completed' : 'Available'}
                    </div>
                  </div>
                  <p className="task-desc">{task.description}</p>
                  <div className="task-action-row">
                    <span className="task-reward">${task.reward}</span>
                    {task.status !== 'completed' && (
                      <button className="premium-btn primary-btn small-btn" onClick={() => handleCompleteTask(task.id)}>
                        Complete Task
                      </button>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Packages Preview Component */}
        <div className="work-section mt-5">
          <div className="section-head">
            <h3><FiBox className="text-orange" /> Quick Packages</h3>
          </div>

          <div className="work-grid">
            {packages.length === 0 ? (
              <div className="empty-state-card">
                <p>No premium packages available right now.</p>
              </div>
            ) : (
              packages.map((pkg, idx) => (
                <motion.div
                  key={pkg.id || idx}
                  className="premium-task-card package-variant"
                  initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                >
                  <div className="pkg-head">
                    <h4>{pkg.name}</h4>
                    <span className="pkg-price">Rs. {pkg.price}</span>
                  </div>
                  <div className="pkg-stats">
                    <div className="pkg-stat-row">
                      <span>Daily Ads:</span> <strong>{pkg.ads_per_day}</strong>
                    </div>
                    <div className="pkg-stat-row">
                      <span>Daily Earning:</span> <strong className="text-orange">Rs. {Number(pkg.ads_per_day || 0) * Number(pkg.earn_per_ad || 0)}</strong>
                    </div>
                  </div>
                  <button className="premium-btn outline-orange-btn w-100 mt-3" onClick={() => navigate('/package-deposit', { state: { package: pkg } })}>
                    Purchase Package
                  </button>
                </motion.div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Work
