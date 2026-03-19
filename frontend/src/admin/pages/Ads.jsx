import React, { useEffect, useState } from 'react'
import { Card, Button, Form, Modal, Badge } from 'react-bootstrap'
import DataTable from '../components/DataTable'
import ConfirmationDialog from '../components/ConfirmationDialog'
import LoadingSpinner from '../components/LoadingSpinner'
import {
  getAllAds,
  createAd,
  updateAd,
  deleteAd,
} from '../services/adminApi'
import { showError, showSuccess } from '../../services/notify'

const Ads = () => {
  const [loading, setLoading] = useState(true)
  const [ads, setAds] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [selected, setSelected] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    rewardAmount: '',
    url: '',
    provider: 'manual',
    dailyCap: '',
    isActive: true,
  })

  const fetchAds = async () => {
    try {
      setLoading(true)
      const response = await getAllAds()
      setAds(response.data.ads || [])
    } catch (error) {
      showError(error, 'Failed to load ads')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAds()
  }, [])

  const handleOpenModal = (ad = null) => {
    setEditing(ad)
    if (ad) {
      setFormData({
        title: ad.title || '',
        description: ad.description || '',
        rewardAmount: ad.reward_amount || '',
        url: ad.url || '',
        provider: ad.provider || 'manual',
        dailyCap: ad.daily_cap || '',
        isActive: ad.is_active !== false,
      })
    } else {
      setFormData({
        title: '',
        description: '',
        rewardAmount: '',
        url: '',
        provider: 'manual',
        dailyCap: '',
        isActive: true,
      })
    }
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editing) {
        await updateAd(editing.id, formData)
        showSuccess('Ad updated')
      } else {
        await createAd(formData)
        showSuccess('Ad created')
      }
      setShowModal(false)
      fetchAds()
    } catch (error) {
      showError(error, editing ? 'Failed to update ad' : 'Failed to create ad')
    }
  }

  const handleDelete = async () => {
    if (!selected) {
      showError(null, 'No ad selected')
      return
    }
    try {
      await deleteAd(selected.id)
      showSuccess('Ad deleted')
      setShowConfirm(false)
      fetchAds()
    } catch (error) {
      showError(error, 'Failed to delete ad')
    }
  }

  const columns = [
    { header: 'Title', accessor: 'title' },
    { header: 'Provider', render: (row) => row.provider || 'manual' },
    { header: 'Reward', render: (row) => `Rs. ${row.reward_amount}` },
    { header: 'Daily Cap', render: (row) => row.daily_cap || '-' },
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
    return <LoadingSpinner text="Loading ads..." />
  }

  return (
    <div className="admin-page">
      <div className="page-header d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Ads</h2>
          <p className="text-muted">Manage ads and reward amounts</p>
        </div>
        <Button variant="primary" onClick={() => handleOpenModal()}>
          + New Ad
        </Button>
      </div>

      <Card>
        <Card.Body>
          <DataTable columns={columns} data={ads} loading={loading} />
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editing ? 'Edit Ad' : 'Create Ad'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Title *</Form.Label>
              <Form.Control
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
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
              <Form.Label>Reward Amount (PKR)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={formData.rewardAmount}
                onChange={(e) => setFormData({ ...formData, rewardAmount: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ad URL *</Form.Label>
              <Form.Control
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Provider</Form.Label>
              <Form.Control
                type="text"
                value={formData.provider}
                onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Daily Cap</Form.Label>
              <Form.Control
                type="number"
                value={formData.dailyCap}
                onChange={(e) => setFormData({ ...formData, dailyCap: e.target.value })}
              />
            </Form.Group>
            <Form.Check
              type="switch"
              id="ad-active"
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
        title="Delete Ad"
        message={`Delete "${selected?.title}"? This cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  )
}

export default Ads
