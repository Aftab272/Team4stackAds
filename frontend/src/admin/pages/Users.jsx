import React, { useState, useEffect } from 'react'
import { Card, Button, Form, InputGroup, Badge } from 'react-bootstrap'
import DataTable from '../components/DataTable'
import ConfirmationDialog from '../components/ConfirmationDialog'
import LoadingSpinner from '../components/LoadingSpinner'
import { getAllUsers, updateUserStatus, deleteUser } from '../services/adminApi'
import { showError, showSuccess } from '../../services/notify'

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
      showError(error, 'Failed to load users')
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
      showSuccess(`User ${newStatus} successfully`)
      fetchUsers()
    } catch (error) {
      showError(error, 'Failed to update user status')
    }
  }

  const handleDelete = async () => {
    if (!selectedUser) {
      showError(null, 'No user selected')
      return
    }
    try {
      await deleteUser(selectedUser.id)
      showSuccess('User deleted successfully')
      setShowConfirm(false)
      fetchUsers()
    } catch (error) {
      showError(error, 'Failed to delete user')
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
          <Form.Group>
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
          </Form.Group>
          <Form.Group className="mt-3" style={{ maxWidth: '200px' }}>
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
          </Form.Group>
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
