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
