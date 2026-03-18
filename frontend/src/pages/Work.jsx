import React, { useState, useEffect } from 'react'
import { Container, Card, Button, Badge, Alert } from 'react-bootstrap'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import './Page.css'
import './Work.css'

const Work = () => {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState({ type: '', text: '' })
  const packages = [
    {
      name: 'Starter Package',
      price: 'Rs. 700',
      adsPerDay: 500,
      earningPerAd: 'Rs. 0.20',
      dailyEarning: 'Rs. 100',
      weeklyEarning: 'Rs. 700',
      accent: 'starter'
    },
    {
      name: 'Basic Package',
      price: 'Rs. 1,500',
      adsPerDay: 800,
      earningPerAd: 'Rs. 0.25',
      dailyEarning: 'Rs. 200',
      weeklyEarning: 'Rs. 1,400',
      accent: 'basic'
    },
    {
      name: 'Standard Package',
      price: 'Rs. 3,000',
      adsPerDay: 1200,
      earningPerAd: 'Rs. 0.30',
      dailyEarning: 'Rs. 360',
      weeklyEarning: 'Rs. 2,520',
      accent: 'standard'
    },
    {
      name: 'Premium Package',
      price: 'Rs. 6,000',
      adsPerDay: 2000,
      earningPerAd: 'Rs. 0.35',
      dailyEarning: 'Rs. 700',
      weeklyEarning: 'Rs. 4,900',
      accent: 'premium'
    },
    {
      name: 'VIP Package',
      price: 'Rs. 10,000',
      adsPerDay: 3000,
      earningPerAd: 'Rs. 0.40',
      dailyEarning: 'Rs. 1,200',
      weeklyEarning: 'Rs. 8,400',
      accent: 'vip'
    },
    {
      name: 'Elite Package',
      price: 'Rs. 15,000',
      adsPerDay: 4000,
      earningPerAd: 'Rs. 0.45',
      dailyEarning: 'Rs. 1,800',
      weeklyEarning: 'Rs. 12,600',
      accent: 'elite'
    }
  ]

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/tasks`)
      setTasks(response.data.tasks || [])
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteTask = async (taskId) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/tasks/${taskId}/complete`)
      setMessage({ type: 'success', text: response.data.message || 'Task completed successfully!' })
      fetchTasks()
    } catch (error) {
      setMessage({
        type: 'danger',
        text: error.response?.data?.message || 'Failed to complete task',
      })
    }
  }

  return (
    <Container className="page-container work-page">
      <div className="back-button-container">
        <button
          type="button"
          className="back-dashboard-button"
          onClick={() => navigate('/quick-actions')}
        >
          <FiArrowLeft />
          Back to Quick Actions
        </button>
      </div>
      <div className="work-title-box">
        <h1 className="page-title work-title">Available Tasks</h1>
      </div>

      <div className="work-packages">
        <h2 className="work-section-title">Packages</h2>
        <div className="row">
          {packages.map((pkg) => (
            <div key={pkg.name} className="col-lg-4 col-md-6 mb-3">
              <Card className={`package-card ${pkg.accent}`}>
                <Card.Body>
                  <div className="package-header">
                    <h4>{pkg.name}</h4>
                    <span className="package-price">{pkg.price}</span>
                  </div>
                  <div className="package-grid">
                    <div>
                      <span>Ads / Day</span>
                      <strong>{pkg.adsPerDay}</strong>
                    </div>
                    <div>
                      <span>Earning / Ad</span>
                      <strong>{pkg.earningPerAd}</strong>
                    </div>
                    <div>
                      <span>Daily Earning</span>
                      <strong>{pkg.dailyEarning}</strong>
                    </div>
                    <div>
                      <span>Weekly Earning</span>
                      <strong>{pkg.weeklyEarning}</strong>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="package-cta"
                    onClick={() => navigate('/package-deposit', { state: { package: pkg } })}
                  >
                    Purchase Package
                  </button>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      </div>
      
      {message.text && (
        <Alert variant={message.type} dismissible onClose={() => setMessage({ type: '', text: '' })}>
          {message.text}
        </Alert>
      )}

      {tasks.length === 0 ? (
        <Card className="page-card">
          <Card.Body>
            <p className="text-center text-muted">No tasks available at the moment. Check back later!</p>
          </Card.Body>
        </Card>
      ) : (
        <div className="row">
          {tasks.map((task) => (
            <div key={task.id} className="col-md-6 mb-3">
              <Card className="page-card h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h4>{task.title}</h4>
                    <Badge bg={task.status === 'completed' ? 'success' : 'primary'}>
                      {task.status}
                    </Badge>
                  </div>
                  <p className="text-muted">{task.description}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="h5 text-success mb-0">${task.reward}</span>
                    {task.status !== 'completed' && (
                      <Button
                        variant="primary"
                        onClick={() => handleCompleteTask(task.id)}
                      >
                        Complete Task
                      </Button>
                    )}
                  </div>
                  {task.deadline && (
                    <small className="text-muted d-block mt-2">
                      Deadline: {new Date(task.deadline).toLocaleDateString()}
                    </small>
                  )}
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      )}
    </Container>
  )
}

export default Work
