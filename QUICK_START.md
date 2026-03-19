# Quick Start Guide - Team4StackAds

## 🚀 Get Started in 5 Minutes

### Step 1: Set Up Supabase Database (2 minutes)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Wait for the project to initialize
4. Go to **SQL Editor** in the left sidebar
5. Click **New Query**
6. Copy the entire contents of `backend/database/schema.sql`
7. Paste it into the SQL Editor
8. Click **Run** (or press Ctrl+Enter)

✅ Your database is now set up!

### Step 2: Get Your Supabase Credentials (1 minute)

1. In Supabase, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)

### Step 3: Set Up Environment Variables (1 minute)

#### Frontend `.env` file

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000
VITE_SUPABASE_URL=paste-your-project-url-here
VITE_SUPABASE_ANON_KEY=paste-your-anon-key-here
```

#### Backend `.env.local` file

Create `backend/.env.local`:
```env
SUPABASE_URL=paste-your-project-url-here
SUPABASE_ANON_KEY=paste-your-anon-key-here
JWT_SECRET=generate-a-random-secret-key-here
```

**To generate JWT_SECRET**, run this in terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 4: Install Dependencies (1 minute)

Open **two terminal windows**:

**Terminal 1 - Backend:**
```bash
cd backend
npm install
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
```

### Step 5: Run the Application (1 minute)

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run dev
```
✅ Backend running on http://localhost:5000

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
```
✅ Frontend running on http://localhost:3000

### Step 6: Test the Application

1. Open your browser to `http://localhost:3000`
2. Click **Sign In** → **Sign up here**
3. Create a new account
4. You should see the dashboard with 9 colorful cards!

## 🎉 You're Done!

The application is now running. You can:
- Register new users
- Complete tasks
- View your wallet
- Check team referrals
- And more!

## 🐛 Troubleshooting

**Port already in use?**
- Change ports in `package.json` or kill the process:
  - Windows: `netstat -ano | findstr :3000` then `taskkill /PID <pid> /F`
  - Mac/Linux: `lsof -ti:3000 | xargs kill`

**Database connection errors?**
- Double-check your `.env` files have the correct Supabase URL and key
- Make sure you ran the SQL schema in Supabase

**Module errors?**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

## 📝 Next Steps After Setup

1. **Add some test data:**
   - Create tasks in Supabase (or add an admin panel)
   - Add some announcements

2. **Customize:**
   - Update colors in CSS files
   - Modify card icons and labels
   - Add your branding

3. **Deploy:**
   - Frontend: Deploy to Vercel/Netlify
   - Backend: Deploy to Vercel/Railway
   - Update environment variables in hosting platform
