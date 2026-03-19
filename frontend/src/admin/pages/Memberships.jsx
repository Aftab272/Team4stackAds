import React, { useEffect, useState } from 'react'
import { Card, Button, Form, Modal, Badge } from 'react-bootstrap'
import DataTable from '../components/DataTable'
import ConfirmationDialog from '../components/ConfirmationDialog'
import LoadingSpinner from '../components/LoadingSpinner'
import {
  getAllMemberships,
  createMembership,
  updateMembership,
  deleteMembership,
} from '../services/adminApi'
import { showError, showSuccess } from '../../services/notify'

const Memberships = () => {
  const [loading, setLoading] = useState(true)
  const [memberships, setMemberships] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [selected, setSelected] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    adsPerDay: '',
    earnPerAd: '',
    durationDays: '',
    minWithdraw: '',
    isActive: true,
  })

  const fetchMemberships = async () => {
    try {
      setLoading(true)
      const response = await getAllMemberships()
      setMemberships(response.data.memberships || [])
    } catch (error) {
      showError(error, 'Failed to load memberships')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMemberships()
  }, [])

  const handleOpenModal = (membership = null) => {
    setEditing(membership)
    if (membership) {
      setFormData({
        name: membership.name || '',
        price: membership.price || '',
        adsPerDay: membership.ads_per_day || '',
        earnPerAd: membership.earn_per_ad || '',
        durationDays: membership.duration_days || '',
        minWithdraw: membership.min_withdraw || '',
        isActive: membership.is_active !== false,
      })
    } else {
      setFormData({
        name: '',
        price: '',
        adsPerDay: '',
        earnPerAd: '',
        durationDays: 30,
        minWithdraw: 200,
        isActive: true,
      })
    }
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editing) {
        await updateMembership(editing.id, formData)
        showSuccess('Membership updated')
      } else {
        await createMembership(formData)
        showSuccess('Membership created')
      }
      setShowModal(false)
      fetchMemberships()
    } catch (error) {
      showError(error, editing ? 'Failed to update membership' : 'Failed to create membership')
    }
  }

  const handleDelete = async () => {
    if (!selected) {
      showError(null, 'No membership selected')
      return
    }
    try {
      await deleteMembership(selected.id)
      showSuccess('Membership deleted')
      setShowConfirm(false)
      fetchMemberships()
    } catch (error) {
      showError(error, 'Failed to delete membership')
    }
  }

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Price', render: (row) => `Rs. ${row.price}` },
    { header: 'Ads/Day', render: (row) => row.ads_per_day },
    { header: 'Earn/Ad', render: (row) => `Rs. ${row.earn_per_ad}` },
    { header: 'Duration', render: (row) => `${row.duration_days} days` },
    { header: 'Min Withdraw', render: (row) => `Rs. ${row.min_withdraw}` },
    {
      header: 'Status',
      render: (row) => (
        <Badge bg={row.is_active ? 'success' : 'secondary'}>
          {row.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
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
              setSelected(row)
              setShowConfirm(true)
            }}
          >
            Delete
          </Button>
        </>
      ),
    },
  ]

  if (loading) {
    return <LoadingSpinner text="Loading memberships..." />
  }

  return (
    <div className="admin-page">
      <div className="page-header d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Memberships</h2>
          <p className="text-muted">Manage package plans and limits</p>
        </div>
        <Button variant="primary" onClick={() => handleOpenModal()}>
          + New Membership
        </Button>
      </div>

      <Card>
        <Card.Body>
          <DataTable columns={columns} data={memberships} loading={loading} />
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editing ? 'Edit Membership' : 'Create Membership'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name *</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price (PKR) *</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ads Per Day</Form.Label>
              <Form.Control
                type="number"
                value={formData.adsPerDay}
                onChange={(e) => setFormData({ ...formData, adsPerDay: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Earn Per Ad (PKR)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={formData.earnPerAd}
                onChange={(e) => setFormData({ ...formData, earnPerAd: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Duration (Days)</Form.Label>
              <Form.Control
                type="number"
                value={formData.durationDays}
                onChange={(e) => setFormData({ ...formData, durationDays: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Minimum Withdraw (PKR)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={formData.minWithdraw}
                onChange={(e) => setFormData({ ...formData, minWithdraw: e.target.value })}
              />
            </Form.Group>
            <Form.Check
              type="switch"
              id="membership-active"
              label="Active"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editing ? 'Update' : 'Create'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <ConfirmationDialog
        show={showConfirm}
        onHide={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Membership"
        message={`Delete "${selected?.name}"? This cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  )
}

export default Memberships
