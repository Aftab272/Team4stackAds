# Team4StackAds

A modern responsive web application and mobile-friendly dashboard for team management, earnings, and task tracking.

## Project Structure

```
team4stackads/
├── frontend/   (React App)
│   ├── src/
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   ├── assets
│   │   └── App.jsx
│   └── package.json
│
└── backend/   (Next.js API Backend)
    ├── pages/api
    ├── controllers
    ├── models
    ├── routes
    ├── middleware
    └── database
```

## Technology Stack

### Frontend
- React.js
- Bootstrap & React Bootstrap
- Axios for API requests
- React Router
- Vite

### Backend
- Next.js (API routes)
- Node.js
- Supabase Database
- JWT Authentication

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Supabase account

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```env
VITE_API_URL=http://localhost:5000
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Start development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file:
```env
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
JWT_SECRET=your-jwt-secret-key
```

4. Start development server:
```bash
npm run dev
```

The backend API will run on `http://localhost:5000`

## Database Setup (Supabase)

Create the following tables in your Supabase database:

1. **users** - User accounts
2. **withdraw_requests** - Withdrawal requests
3. **tasks** - Work tasks
4. **wallet** - User wallet balances
5. **team_referrals** - Team referral system
6. **notifications** - User notifications

See `backend/database/schema.sql` for detailed schema.

## Features

- User Authentication (Register/Login)
- Dashboard with colorful card navigation
- Withdraw Request System
- Team Referral System
- Work Tasks Management
- Salary/Earnings Tracking
- Wallet Balance
- Official Announcement Channel
- Contact Form
- About Page
- Guide Page

## License

MIT
