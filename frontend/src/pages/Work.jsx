import React, { useState, useEffect } from 'react'
import { Container, Card, Button, Badge, Alert } from 'react-bootstrap'
import axios from 'axios'
import './Page.css'

const Work = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState({ type: '', text: '' })

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
    <Container className="page-container">
      <h1 className="page-title">Available Tasks</h1>
      
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
