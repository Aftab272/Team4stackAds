const supabase = require('../database/supabase')

const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    const { data: contactMessage, error } = await supabase
      .from('contact_messages')
      .insert({
        name,
        email,
        subject,
        message,
        is_read: false,
      })
      .select()
      .single()

    if (error) {
      return res.status(500).json({ message: 'Error submitting message', error: error.message })
    }

    res.status(201).json({
      message: 'Message submitted successfully',
      contactMessage,
    })
  } catch (error) {
    console.error('Submit contact error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

module.exports = { submitContact }
