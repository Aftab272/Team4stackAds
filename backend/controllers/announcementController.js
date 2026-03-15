const supabase = require('../database/supabase')

const getAnnouncements = async (req, res) => {
  try {
    const { data: announcements, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) {
      return res.status(500).json({ message: 'Error fetching announcements', error: error.message })
    }

    res.json({ announcements: announcements || [] })
  } catch (error) {
    console.error('Get announcements error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

// Admin: Get all announcements with pagination
const getAllAnnouncements = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query
    const offset = (page - 1) * limit

    const { data: announcements, error, count } = await supabase
      .from('announcements')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + parseInt(limit) - 1)

    if (error) {
      return res.status(500).json({ message: 'Error fetching announcements', error: error.message })
    }

    res.json({
      announcements: announcements || [],
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit)),
      },
    })
  } catch (error) {
    console.error('Get all announcements error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

// Admin: Create new announcement
const createAnnouncement = async (req, res) => {
  try {
    const { title, content, isImportant } = req.body
    const adminId = req.user.userId

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' })
    }

    const { data: announcement, error } = await supabase
      .from('announcements')
      .insert({
        title,
        content,
        is_important: isImportant || false,
      })
      .select()
      .single()

    if (error) {
      return res.status(500).json({ message: 'Error creating announcement', error: error.message })
    }

    // Log admin activity
    const { logAdminActivity } = require('./adminController')
    await logAdminActivity(adminId, 'CREATE_ANNOUNCEMENT', 'announcements', announcement.id, { title })

    res.status(201).json({ message: 'Announcement created successfully', announcement })
  } catch (error) {
    console.error('Create announcement error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

// Admin: Update announcement
const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params
    const { title, content, isImportant } = req.body
    const adminId = req.user.userId

    const updateData = {}
    if (title) updateData.title = title
    if (content !== undefined) updateData.content = content
    if (isImportant !== undefined) updateData.is_important = isImportant

    const { data: announcement, error } = await supabase
      .from('announcements')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return res.status(500).json({ message: 'Error updating announcement', error: error.message })
    }

    // Log admin activity
    const { logAdminActivity } = require('./adminController')
    await logAdminActivity(adminId, 'UPDATE_ANNOUNCEMENT', 'announcements', id, updateData)

    res.json({ message: 'Announcement updated successfully', announcement })
  } catch (error) {
    console.error('Update announcement error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

// Admin: Delete announcement
const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params
    const adminId = req.user.userId

    const { error } = await supabase
      .from('announcements')
      .delete()
      .eq('id', id)

    if (error) {
      return res.status(500).json({ message: 'Error deleting announcement', error: error.message })
    }

    // Log admin activity
    const { logAdminActivity } = require('./adminController')
    await logAdminActivity(adminId, 'DELETE_ANNOUNCEMENT', 'announcements', id, {})

    res.json({ message: 'Announcement deleted successfully' })
  } catch (error) {
    console.error('Delete announcement error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

module.exports = { 
  getAnnouncements,
  getAllAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
}
