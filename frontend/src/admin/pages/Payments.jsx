import React, { useEffect, useState } from 'react'
import { Card, Button, Badge, Form, Modal } from 'react-bootstrap'
import DataTable from '../components/DataTable'
import LoadingSpinner from '../components/LoadingSpinner'
import { getAllPayments, approvePayment, rejectPayment } from '../services/adminApi'
import { showError, showSuccess } from '../../services/notify'

const Payments = () => {
  const [loading, setLoading] = useState(true)
  const [payments, setPayments] = useState([])
  const [pagination, setPagination] = useState(null)
  const [statusFilter, setStatusFilter] = useState('pending')
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [rejectReason, setRejectReason] = useState('')

  const fetchPayments = async (page = 1) => {
    try {
      setLoading(true)
      const response = await getAllPayments({
        page,
        limit: 20,
        status: statusFilter,
      })
      setPayments(response.data.payments || [])
      setPagination(response.data.pagination)
    } catch (error) {
      showError(error, 'Failed to load payments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPayments()
  }, [statusFilter])

  const handleApprove = async (id) => {
    try {
      await approvePayment(id)
      showSuccess('Payment approved and membership activated')
      fetchPayments()
    } catch (error) {
      showError(error, 'Failed to approve payment')
    }
  }

  const handleReject = async () => {
    if (!selectedPayment) {
      showError(null, 'No payment selected')
      return
    }
    try {
      await rejectPayment(selectedPayment.id, rejectReason)
      showSuccess('Payment rejected')
      setShowRejectModal(false)
      setRejectReason('')
      fetchPayments()
    } catch (error) {
      showError(error, 'Failed to reject payment')
    }
  }

  const columns = [
    { header: 'User', render: (row) => `${row.userName} (${row.userEmail})` },
    { header: 'Amount', render: (row) => `Rs. ${row.amount}` },
    { header: 'Gateway', render: (row) => row.gateway || 'manual' },
    { header: 'Reference', render: (row) => row.reference || '-' },
    { header: 'Date', render: (row) => new Date(row.created_at).toLocaleDateString() },
    {
      header: 'Status',
      render: (row) => (
        <Badge bg={
          row.status === 'paid' ? 'success' :
          row.status === 'failed' ? 'danger' : 'warning'
        }>
          {row.status}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      render: (row) => (
        row.status === 'pending' && (
          <>
            <Button variant="outline-success" size="sm" onClick={() => handleApprove(row.id)}>
              Approve
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              className="ms-2"
              onClick={() => {
                setSelectedPayment(row)
                setShowRejectModal(true)
              }}
            >
              Reject
            </Button>
          </>
        )
      ),
    },
  ]

  if (loading) {
    return <LoadingSpinner text="Loading payments..." />
  }

  return (
    <div className="admin-page">
      <div className="page-header mb-4">
        <h2>Payments</h2>
        <p className="text-muted">Review and approve membership payments</p>
      </div>

      <Card className="mb-4">
        <Card.Body>
          <Form.Select
            className="admin-filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
            <option value="all">All</option>
          </Form.Select>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <DataTable
            columns={columns}
            data={payments}
            loading={loading}
            pagination={pagination}
            onPageChange={(page) => fetchPayments(page)}
          />
        </Card.Body>
      </Card>

      <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Reject Payment</Modal.Title>
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

export default Payments
