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

module.exports = { getAnnouncements }
