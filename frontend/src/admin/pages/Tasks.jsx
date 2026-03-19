import React, { useState, useEffect } from 'react'
import { Card, Button, Form, Modal } from 'react-bootstrap'
import DataTable from '../components/DataTable'
import ConfirmationDialog from '../components/ConfirmationDialog'
import LoadingSpinner from '../components/LoadingSpinner'
import { getAllTasks, createTask, updateTask, deleteTask } from '../services/adminApi'
import { showError, showSuccess } from '../../services/notify'

const Tasks = () => {
  const [loading, setLoading] = useState(true)
  const [tasks, setTasks] = useState([])
  const [pagination, setPagination] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    reward: '',
    deadline: ''
  })
  const [showConfirm, setShowConfirm] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState(null)

  const fetchTasks = async (page = 1) => {
    try {
      setLoading(true)
      const response = await getAllTasks({ page, limit: 20 })
      setTasks(response.data.tasks)
      setPagination(response.data.pagination)
    } catch (error) {
      showError(error, 'Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const handleOpenModal = (task = null) => {
    setEditingTask(task)
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        reward: task.reward.toString(),
        deadline: task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : ''
      })
    } else {
      setFormData({
        title: '',
        description: '',
        reward: '',
        deadline: ''
      })
    }
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingTask) {
        await updateTask(editingTask.id, formData)
        showSuccess('Task updated successfully')
      } else {
        await createTask(formData)
        showSuccess('Task created successfully')
      }
      setShowModal(false)
      fetchTasks()
    } catch (error) {
      showError(error, editingTask ? 'Failed to update task' : 'Failed to create task')
    }
  }

  const handleDelete = async () => {
    if (!taskToDelete) {
      showError(null, 'No task selected')
      return
    }
    try {
      await deleteTask(taskToDelete.id)
      showSuccess('Task deleted successfully')
      setShowConfirm(false)
      fetchTasks()
    } catch (error) {
      showError(error, 'Failed to delete task')
    }
  }

  const columns = [
    { header: 'Title', accessor: 'title' },
    { header: 'Description', accessor: 'description' },
    { header: 'Reward', render: (row) => `$${row.reward.toFixed(2)}` },
    {
      header: 'Status',
      render: (row) => (
        <span className={`badge bg-${row.status === 'active' ? 'success' : 'secondary'}`}>
          {row.status}
        </span>
      )
    },
    { header: 'Created', render: (row) => new Date(row.created_at).toLocaleDateString() },
    {
      header: 'Actions',
      render: (row) => (
        <>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => handleOpenModal(row)}
          >
            Edit
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            className="ms-2"
            onClick={() => {
              setTaskToDelete(row)
              setShowConfirm(true)
            }}
          >
            Delete
          </Button>
        </>
      )
    }
  ]

  return (
    <div className="admin-page">
      <div className="page-header d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Task Management</h2>
          <p className="text-muted">Create and manage user tasks</p>
        </div>
        <Button variant="primary" onClick={() => handleOpenModal()}>
          + Create New Task
        </Button>
      </div>

      <Card>
        <Card.Body>
          <DataTable
            columns={columns}
            data={tasks}
            loading={loading}
            pagination={pagination}
            onPageChange={(page) => fetchTasks(page)}
          />
        </Card.Body>
      </Card>

      {/* Create/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingTask ? 'Edit Task' : 'Create New Task'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Title *</Form.Label>
              <Form.Control
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Reward Amount ($) *</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                required
                value={formData.reward}
                onChange={(e) => setFormData({ ...formData, reward: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Deadline (Optional)</Form.Label>
              <Form.Control
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingTask ? 'Update' : 'Create'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <ConfirmationDialog
        show={showConfirm}
        onHide={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${taskToDelete?.title}"?`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  )
}

export default Tasks
