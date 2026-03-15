# Complete Frontend Admin Pages Implementation Guide

## Overview
This guide contains complete implementations for all admin dashboard pages. Copy each code block into the specified file.

---

## 1. Users Management Page

**File:** `frontend/src/admin/pages/Users.jsx`

```jsx
import React, { useState, useEffect } from 'react'
import { Card, Button, Form, InputGroup, Badge } from 'react-bootstrap'
import DataTable from '../components/DataTable'
import ConfirmationDialog from '../components/ConfirmationDialog'
import LoadingSpinner from '../components/LoadingSpinner'
import { getAllUsers, updateUserStatus, deleteUser } from '../services/adminApi'
import { toast } from 'react-toastify'

const Users = () => {
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState([])
  const [pagination, setPagination] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showConfirm, setShowConfirm] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [actionType, setActionType] = useState('')

  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true)
      const response = await getAllUsers({
        page,
        limit: 20,
        search: searchTerm,
        status: statusFilter
      })
      setUsers(response.data.users)
      setPagination(response.data.pagination)
    } catch (error) {
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleSearch = () => {
    fetchUsers(1)
  }

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await updateUserStatus(userId, newStatus)
      toast.success(`User ${newStatus} successfully`)
      fetchUsers()
    } catch (error) {
      toast.error('Failed to update user status')
    }
  }

  const handleDelete = async () => {
    try {
      await deleteUser(selectedUser.id)
      toast.success('User deleted successfully')
      setShowConfirm(false)
      fetchUsers()
    } catch (error) {
      toast.error('Failed to delete user')
    }
  }

  const confirmAction = (user, type) => {
    setSelectedUser(user)
    setActionType(type)
    setShowConfirm(true)
  }

  const columns = [
    { header: 'Name', render: (row) => row.name },
    { header: 'Email', accessor: 'email' },
    { 
      header: 'Wallet Balance', 
      render: (row) => `$${row.walletBalance?.toFixed(2) || '0.00'}` 
    },
    { header: 'Referrals', render: (row) => row.referralCount || 0 },
    {
      header: 'Status',
      render: (row) => (
        <Badge bg={row.status === 'active' ? 'success' : 'danger'}>
          {row.status}
        </Badge>
      )
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="action-buttons">
          {row.status === 'active' ? (
            <Button
              variant="outline-warning"
              size="sm"
              onClick={() => confirmAction(row, 'suspend')}
            >
              Suspend
            </Button>
          ) : (
            <Button
              variant="outline-success"
              size="sm"
              onClick={() => handleStatusChange(row.id, 'active')}
            >
              Activate
            </Button>
          )}
          <Button
            variant="outline-danger"
            size="sm"
            className="ms-2"
            onClick={() => confirmAction(row, 'delete')}
          >
            Delete
          </Button>
        </div>
      )
    }
  ]

  return (
    <div className="admin-page">
      <div className="page-header d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>User Management</h2>
          <p className="text-muted">Manage all registered users</p>
        </div>
      </div>

      <Card className="mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={6}>
              <InputGroup>
                <Form.Control
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button variant="primary" onClick={handleSearch}>
                  Search
                </Button>
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  setTimeout(() => fetchUsers(1), 100)
                }}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <DataTable
            columns={columns}
            data={users}
            loading={loading}
            pagination={pagination}
            onPageChange={(page) => fetchUsers(page)}
          />
        </Card.Body>
      </Card>

      <ConfirmationDialog
        show={showConfirm}
        onHide={() => setShowConfirm(false)}
        onConfirm={actionType === 'delete' ? handleDelete : () => handleStatusChange(selectedUser.id, 'suspended')}
        title={actionType === 'delete' ? 'Delete User' : 'Suspend User'}
        message={
          actionType === 'delete'
            ? `Are you sure you want to delete ${selectedUser?.name}? This action cannot be undone.`
            : `Are you sure you want to suspend ${selectedUser?.name}?`
        }
        confirmText={actionType === 'delete' ? 'Delete' : 'Suspend'}
        variant={actionType === 'delete' ? 'danger' : 'warning'}
      />
    </div>
  )
}

export default Users
```

---

## 2. Withdraw Requests Page

**File:** `frontend/src/admin/pages/WithdrawRequests.jsx`

```jsx
import React, { useState, useEffect } from 'react'
import { Card, Button, Badge, Form, Modal } from 'react-bootstrap'
import DataTable from '../components/DataTable'
import ConfirmationDialog from '../components/ConfirmationDialog'
import LoadingSpinner from '../components/LoadingSpinner'
import { getAllWithdrawRequests, approveWithdrawal, rejectWithdrawal } from '../services/adminApi'
import { toast } from 'react-toastify'

const WithdrawRequests = () => {
  const [loading, setLoading] = useState(true)
  const [requests, setRequests] = useState([])
  const [pagination, setPagination] = useState(null)
  const [statusFilter, setStatusFilter] = useState('pending')
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [rejectReason, setRejectReason] = useState('')

  const fetchRequests = async (page = 1) => {
    try {
      setLoading(true)
      const response = await getAllWithdrawRequests({
        page,
        limit: 20,
        status: statusFilter
      })
      setRequests(response.data.requests)
      setPagination(response.data.pagination)
    } catch (error) {
      toast.error('Failed to load withdrawal requests')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [statusFilter])

  const handleApprove = async (id) => {
    try {
      await approveWithdrawal(id)
      toast.success('Withdrawal approved successfully')
      fetchRequests()
    } catch (error) {
      toast.error('Failed to approve withdrawal')
    }
  }

  const handleReject = async () => {
    try {
      await rejectWithdrawal(selectedRequest.id, rejectReason)
      toast.success('Withdrawal rejected')
      setShowRejectModal(false)
      setRejectReason('')
      fetchRequests()
    } catch (error) {
      toast.error('Failed to reject withdrawal')
    }
  }

  const openRejectModal = (request) => {
    setSelectedRequest(request)
    setShowRejectModal(true)
  }

  const columns = [
    { header: 'User', render: (row) => `${row.userName} (${row.userEmail})` },
    { header: 'Amount', render: (row) => `$${row.amount.toFixed(2)}` },
    { header: 'Payment Method', accessor: 'payment_method' },
    { header: 'Date', render: (row) => new Date(row.created_at).toLocaleDateString() },
    {
      header: 'Status',
      render: (row) => (
        <Badge bg={
          row.status === 'approved' ? 'success' :
          row.status === 'rejected' ? 'danger' : 'warning'
        }>
          {row.status}
        </Badge>
      )
    },
    {
      header: 'Actions',
      render: (row) => (
        row.status === 'pending' && (
          <>
            <Button
              variant="outline-success"
              size="sm"
              onClick={() => handleApprove(row.id)}
            >
              Approve
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              className="ms-2"
              onClick={() => openRejectModal(row)}
            >
              Reject
            </Button>
          </>
        )
      )
    }
  ]

  return (
    <div className="admin-page">
      <div className="page-header mb-4">
        <h2>Withdrawal Requests</h2>
        <p className="text-muted">Manage user withdrawal requests</p>
      </div>

      <Card className="mb-4">
        <Card.Body>
          <Form.Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: '200px' }}
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </Form.Select>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <DataTable
            columns={columns}
            data={requests}
            loading={loading}
            pagination={pagination}
            onPageChange={(page) => fetchRequests(page)}
          />
        </Card.Body>
      </Card>

      {/* Reject Modal */}
      <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reject Withdrawal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Rejection Reason</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter reason for rejection..."
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRejectModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleReject} disabled={!rejectReason.trim()}>
            Reject
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default WithdrawRequests
```

---

## 3. Task Management Page

**File:** `frontend/src/admin/pages/Tasks.jsx`

```jsx
import React, { useState, useEffect } from 'react'
import { Card, Button, Form, Modal } from 'react-bootstrap'
import DataTable from '../components/DataTable'
import ConfirmationDialog from '../components/ConfirmationDialog'
import LoadingSpinner from '../components/LoadingSpinner'
import { getAllTasks, createTask, updateTask, deleteTask } from '../services/adminApi'
import { toast } from 'react-toastify'

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
      toast.error('Failed to load tasks')
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
        toast.success('Task updated successfully')
      } else {
        await createTask(formData)
        toast.success('Task created successfully')
      }
      setShowModal(false)
      fetchTasks()
    } catch (error) {
      toast.error(editingTask ? 'Failed to update task' : 'Failed to create task')
    }
  }

  const handleDelete = async () => {
    try {
      await deleteTask(taskToDelete.id)
      toast.success('Task deleted successfully')
      setShowConfirm(false)
      fetchTasks()
    } catch (error) {
      toast.error('Failed to delete task')
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
```

---

## 4. Wallet Management Page

**File:** `frontend/src/admin/pages/Wallet.jsx`

```jsx
import React, { useState, useEffect } from 'react'
import { Card, Row, Col, StatCard as BSStatCard } from 'react-bootstrap'
import DataTable from '../components/DataTable'
import LoadingSpinner from '../components/LoadingSpinner'
import { getAllWalletTransactions, getWalletStatistics } from '../services/adminApi'
import { FiDollarSign, FiTrendingUp, FiCreditCard } from 'react-icons/fi'

const Wallet = () => {
  const [loading, setLoading] = useState(true)
  const [transactions, setTransactions] = useState([])
  const [pagination, setPagination] = useState(null)
  const [statistics, setStatistics] = useState(null)

  const fetchTransactions = async (page = 1) => {
    try {
      setLoading(true)
      const response = await getAllWalletTransactions({ page, limit: 50 })
      setTransactions(response.data.transactions)
      setPagination(response.data.pagination)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStatistics = async () => {
    try {
      const response = await getWalletStatistics()
      setStatistics(response.data.statistics)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  useEffect(() => {
    fetchTransactions()
    fetchStatistics()
  }, [])

  const columns = [
    { header: 'User', render: (row) => `${row.userName} (${row.userEmail})` },
    { header: 'Type', render: (row) => (
      <span className={`badge bg-${row.type === 'credit' ? 'success' : 'danger'}`}>
        {row.type.toUpperCase()}
      </span>
    )},
    { header: 'Amount', render: (row) => `$${row.amount.toFixed(2)}` },
    { header: 'Balance After', render: (row) => `$${row.balance_after.toFixed(2)}` },
    { header: 'Description', accessor: 'description' },
    { header: 'Date', render: (row) => new Date(row.created_at).toLocaleString() }
  ]

  return (
    <div className="admin-page">
      <div className="page-header mb-4">
        <h2>Wallet Management</h2>
        <p className="text-muted">Monitor all wallet transactions</p>
      </div>

      {/* Statistics Cards */}
      <Row className="g-4 mb-4">
        <Col md={4}>
          <BSStatCard className="border-start border-4 border-primary">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Total Balance</h6>
                  <h3 className="mb-0">${statistics?.totalBalance?.toFixed(2) || '0.00'}</h3>
                </div>
                <FiDollarSign size={32} className="text-primary" />
              </div>
            </Card.Body>
          </BSStatCard>
        </Col>
        <Col md={4}>
          <BSStatCard className="border-start border-4 border-success">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Total Earned</h6>
                  <h3 className="mb-0">${statistics?.totalEarned?.toFixed(2) || '0.00'}</h3>
                </div>
                <FiTrendingUp size={32} className="text-success" />
              </div>
            </Card.Body>
          </BSStatCard>
        </Col>
        <Col md={4}>
          <BSStatCard className="border-start border-4 border-info">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Total Transactions</h6>
                  <h3 className="mb-0">{statistics?.totalTransactions || 0}</h3>
                </div>
                <FiCreditCard size={32} className="text-info" />
              </div>
            </Card.Body>
          </BSStatCard>
        </Col>
      </Row>

      <Card>
        <Card.Body>
          <DataTable
            columns={columns}
            data={transactions}
            loading={loading}
            pagination={pagination}
            onPageChange={(page) => fetchTransactions(page)}
          />
        </Card.Body>
      </Card>
    </div>
  )
}

export default Wallet
```

---

## 5. Announcements Page

**File:** `frontend/src/admin/pages/Announcements.jsx`

```jsx
import React, { useState, useEffect } from 'react'
import { Card, Button, Form, Modal, Badge } from 'react-bootstrap'
import DataTable from '../components/DataTable'
import ConfirmationDialog from '../components/ConfirmationDialog'
import { getAllAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '../services/adminApi'
import { toast } from 'react-toastify'

const Announcements = () => {
  const [loading, setLoading] = useState(true)
  const [announcements, setAnnouncements] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    isImportant: false
  })
  const [showConfirm, setShowConfirm] = useState(false)
  const [announcementToDelete, setAnnouncementToDelete] = useState(null)

  const fetchAnnouncements = async () => {
    try {
      setLoading(true)
      const response = await getAllAnnouncements()
      setAnnouncements(response.data.announcements)
    } catch (error) {
      toast.error('Failed to load announcements')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const handleOpenModal = (announcement = null) => {
    setEditingAnnouncement(announcement)
    if (announcement) {
      setFormData({
        title: announcement.title,
        content: announcement.content,
        isImportant: announcement.is_important
      })
    } else {
      setFormData({ title: '', content: '', isImportant: false })
    }
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingAnnouncement) {
        await updateAnnouncement(editingAnnouncement.id, formData)
        toast.success('Announcement updated')
      } else {
        await createAnnouncement(formData)
        toast.success('Announcement created')
      }
      setShowModal(false)
      fetchAnnouncements()
    } catch (error) {
      toast.error('Operation failed')
    }
  }

  const handleDelete = async () => {
    try {
      await deleteAnnouncement(announcementToDelete.id)
      toast.success('Announcement deleted')
      setShowConfirm(false)
      fetchAnnouncements()
    } catch (error) {
      toast.error('Failed to delete')
    }
  }

  const columns = [
    { header: 'Title', accessor: 'title' },
    { 
      header: 'Content', 
      render: (row) => row.content.substring(0, 80) + (row.content.length > 80 ? '...' : '')
    },
    {
      header: 'Priority',
      render: (row) => row.is_important ? (
        <Badge bg="danger">Important</Badge>
      ) : (
        <Badge bg="secondary">Normal</Badge>
      )
    },
    { header: 'Date', render: (row) => new Date(row.created_at).toLocaleDateString() },
    {
      header: 'Actions',
      render: (row) => (
        <>
          <Button variant="outline-primary" size="sm" onClick={() => handleOpenModal(row)}>
            Edit
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            className="ms-2"
            onClick={() => {
              setAnnouncementToDelete(row)
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
          <h2>Announcements</h2>
          <p className="text-muted">Post updates and notifications</p>
        </div>
        <Button variant="primary" onClick={() => handleOpenModal()}>
          + New Announcement
        </Button>
      </div>

      <Card>
        <Card.Body>
          <DataTable
            columns={columns}
            data={announcements}
            loading={loading}
          />
        </Card.Body>
      </Card>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingAnnouncement ? 'Edit' : 'New'} Announcement</Modal.Title>
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
              <Form.Label>Content *</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />
            </Form.Group>
            <Form.Check
              type="checkbox"
              label="Mark as Important"
              checked={formData.isImportant}
              onChange={(e) => setFormData({ ...formData, isImportant: e.target.checked })}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit">{editingAnnouncement ? 'Update' : 'Create'}</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <ConfirmationDialog
        show={showConfirm}
        onHide={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Announcement"
        message={`Delete "${announcementToDelete?.title}"?`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  )
}

export default Announcements
```

---

## 6. Reports & Analytics Page

**File:** `frontend/src/admin/pages/Reports.jsx`

```jsx
import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Form } from 'react-bootstrap'
import { Line, Bar } from 'react-chartjs-2'
import { Chart as ChartJS } from 'chart.js'
import LoadingSpinner from '../components/LoadingSpinner'
import { getReports } from '../services/adminApi'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)

const Reports = () => {
  const [loading, setLoading] = useState(true)
  const [reportData, setReportData] = useState(null)
  const [reportType, setReportType] = useState('overview')

  useEffect(() => {
    fetchReports()
  }, [reportType])

  const fetchReports = async () => {
    try {
      setLoading(true)
      const response = await getReports(reportType)
      setReportData(response.data.report)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner text="Loading reports..." />

  return (
    <div className="admin-page">
      <div className="page-header mb-4">
        <h2>Reports & Analytics</h2>
        <p className="text-muted">Platform performance insights</p>
      </div>

      <Card className="mb-4">
        <Card.Body>
          <Form.Select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            style={{ width: '250px' }}
          >
            <option value="overview">Overview</option>
            <option value="user-growth">User Growth</option>
            <option value="task-statistics">Task Statistics</option>
            <option value="withdraw-trends">Withdraw Trends</option>
            <option value="revenue">Revenue Analytics</option>
          </Form.Select>
        </Card.Body>
      </Card>

      <Row className="g-4">
        {reportData?.userGrowth && (
          <Col lg={8}>
            <Card>
              <Card.Header>User Registration Growth</Card.Header>
              <Card.Body>
                <div style={{ height: '300px' }}>
                  <Line
                    data={{
                      labels: Object.keys(reportData.userGrowth),
                      datasets: [{
                        label: 'New Users',
                        data: Object.values(reportData.userGrowth),
                        borderColor: '#4e73df',
                        backgroundColor: 'rgba(78, 115, 223, 0.1)',
                        tension: 0.4
                      }]
                    }}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
        )}

        {reportData?.taskStatistics && (
          <Col lg={6}>
            <Card>
              <Card.Header>Task Completion Stats</Card.Header>
              <Card.Body>
                <h3>{reportData.taskStatistics.completedTasks} / {reportData.taskStatistics.totalTasks}</h3>
                <p>Completion Rate: {reportData.taskStatistics.completionRate}%</p>
              </Card.Body>
            </Card>
          </Col>
        )}

        {reportData?.withdrawTrends && (
          <Col lg={6}>
            <Card>
              <Card.Header>Withdrawal Statistics</Card.Header>
              <Card.Body>
                <p>Total: {reportData.withdrawTrends.total}</p>
                <p>Approved: {reportData.withdrawTrends.approved}</p>
                <p>Pending: {reportData.withdrawTrends.pending}</p>
                <p>Total Amount: ${reportData.withdrawTrends.totalAmount.toFixed(2)}</p>
              </Card.Body>
            </Card>
          </Col>
        )}

        {reportData?.revenue && (
          <>
            <Col lg={6}>
              <Card>
                <Card.Header>Revenue Overview</Card.Header>
                <Card.Body>
                  <h4>${reportData.revenue.totalEarned.toFixed(2)}</h4>
                  <p>Total Earned Across Platform</p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={6}>
              <Card>
                <Card.Header>User Metrics</Card.Header>
                <Card.Body>
                  <p>Active Users: {reportData.revenue.activeUsers}</p>
                  <p>Avg Per User: ${reportData.revenue.averagePerUser}</p>
                </Card.Body>
              </Card>
            </Col>
          </>
        )}
      </Row>
    </div>
  )
}

export default Reports
```

---

## Next Steps

After creating these files:

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Update App.jsx** - Add admin routes (next section)

3. **Create Admin.css** - Styling (next section)

Continue with next guide for routing and styling!
