# How to Get Your Supabase Anon Key

## Quick Steps:

1. **Go to your Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project: `jhzamdnplzixrwgwsgdl`

2. **Navigate to Settings → API**
   - Click on the **Settings** icon (gear) in the left sidebar
   - Click on **API** in the settings menu

3. **Copy the "anon" or "public" key**
   - Look for the section labeled **Project API keys**
   - Copy the **anon public** key (it's a long string starting with `eyJ...`)
   - This is safe to use in frontend code

4. **Update your environment files**
   - Replace `YOUR_ANON_KEY_HERE` in:
     - `backend/.env.local`
     - `frontend/.env`

## Example:

Your anon key will look something like:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp...
```

Just copy the entire string and paste it in both `.env` files!
