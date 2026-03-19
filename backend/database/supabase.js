const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL
// Prefer service role key on the server to avoid RLS permission issues during inserts/updates.
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables (SUPABASE_URL and key)')
}

const supabase = createClient(supabaseUrl, supabaseKey)

module.exports = supabase
