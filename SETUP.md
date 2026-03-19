# Team4StackAds Setup Guide

## Prerequisites

Before setting up the project, ensure you have:

- Node.js (v18 or higher) installed
- npm or yarn package manager
- A Supabase account (free tier works)

## Step 1: Supabase Database Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor in your Supabase dashboard
3. Copy and paste the SQL from `backend/database/schema.sql`
4. Run the SQL to create all necessary tables

## Step 2: Environment Variables

### Frontend Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:5000
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

To find your Supabase URL and key:
- Go to your Supabase project settings
- Navigate to API section
- Copy the Project URL and anon/public key

### Backend Environment Variables

Create a `.env.local` file in the `backend/` directory:

```env
SUPABASE_URL=your-supabase-project-url
SUPABASE_ANON_KEY=your-supabase-anon-key
JWT_SECRET=your-strong-random-secret-key-here
```

**Important:** Generate a strong random string for JWT_SECRET. You can use:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Step 3: Install Dependencies

### Frontend

```bash
cd frontend
npm install
```

### Backend

```bash
cd backend
npm install
```

## Step 4: Run the Application

### Start Backend (Terminal 1)

```bash
cd backend
npm run dev
```

The backend will run on `http://localhost:5000`

### Start Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:3000`

## Step 5: Access the Application

1. Open your browser and navigate to `http://localhost:3000`
2. Register a new account
3. Start using the dashboard!

## Project Structure

```
team4stackads/
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/        # Page components
│   │   ├── contexts/     # React contexts (Auth)
│   │   └── App.jsx       # Main app component
│   └── package.json
│
└── backend/               # Next.js API backend
    ├── pages/api/        # API route handlers
    ├── controllers/      # Business logic controllers
    ├── middleware/      # Auth middleware
    ├── database/         # Database configuration
    └── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### User
- `GET /api/user/profile` - Get user profile

### Features
- `GET /api/wallet` - Get wallet balance and transactions
- `POST /api/withdraw` - Create withdrawal request
- `GET /api/withdraw` - Get withdrawal history
- `GET /api/team` - Get team/referral data
- `GET /api/tasks` - Get available tasks
- `POST /api/tasks/:taskId/complete` - Complete a task
- `GET /api/salary` - Get earnings data
- `GET /api/announcements` - Get announcements
- `POST /api/contact` - Submit contact form

## Troubleshooting

### Common Issues

1. **Port already in use**
   - Change the port in `package.json` scripts or kill the process using the port

2. **Supabase connection errors**
   - Verify your environment variables are correct
   - Check that your Supabase project is active

3. **JWT authentication errors**
   - Ensure JWT_SECRET is set in backend `.env.local`
   - Clear browser localStorage and try logging in again

4. **Module not found errors**
   - Delete `node_modules` and `package-lock.json`
   - Run `npm install` again

## Production Deployment

### Frontend
- Build: `npm run build`
- Deploy the `dist` folder to any static hosting (Vercel, Netlify, etc.)

### Backend
- Build: `npm run build`
- Start: `npm start`
- Deploy to Vercel, Railway, or any Node.js hosting platform

Remember to set environment variables in your hosting platform!

## Support

For issues or questions, please check:
- The README.md file
- Supabase documentation
- Next.js documentation
- React documentation
