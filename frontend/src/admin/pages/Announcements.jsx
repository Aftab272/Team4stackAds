import React, { useState, useEffect } from 'react'
import { Card, Button, Form, Modal, Badge } from 'react-bootstrap'
import DataTable from '../components/DataTable'
import ConfirmationDialog from '../components/ConfirmationDialog'
import { getAllAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '../services/adminApi'
import { showError, showSuccess } from '../../services/notify'

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
      showError(error, 'Failed to load announcements')
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
        showSuccess('Announcement updated')
      } else {
        await createAnnouncement(formData)
        showSuccess('Announcement created')
      }
      setShowModal(false)
      fetchAnnouncements()
    } catch (error) {
      showError(error, 'Operation failed')
    }
  }

  const handleDelete = async () => {
    if (!announcementToDelete) {
      showError(null, 'No announcement selected')
      return
    }
    try {
      await deleteAnnouncement(announcementToDelete.id)
      showSuccess('Announcement deleted')
      setShowConfirm(false)
      fetchAnnouncements()
    } catch (error) {
      showError(error, 'Failed to delete')
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
