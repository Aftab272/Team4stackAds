import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
// import 'react-toastify/dist/ReactToastify.css' // Uncomment after npm install
import './App.css'

// User Pages
import Dashboard from './pages/Dashboard'
import Withdraw from './pages/Withdraw'
import Team from './pages/Team'
import Guide from './pages/Guide'
import OfficialChannel from './pages/OfficialChannel'
import Salary from './pages/Salary'
import Work from './pages/Work'
import AboutUs from './pages/AboutUs'
import ContactUs from './pages/ContactUs'
import Wallet from './pages/Wallet'
import UserProfile from './pages/UserProfile'
import OwnerProfile from './pages/OwnerProfile'
import Settings from './pages/Settings'
import Support from './pages/Support'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Terms from './pages/Terms'
import AccountHistory from './pages/AccountHistory'
import SearchHistory from './pages/SearchHistory'
import SecurityPermissions from './pages/SecurityPermissions'
import Accessibility from './pages/Accessibility'
import HelpCenter from './pages/HelpCenter'
import TermsPolicies from './pages/TermsPolicies'
import Notifications from './pages/Notifications'
import Team4StackProfile from './pages/Team4StackProfile'
import QuickActions from './pages/QuickActions'
import PackageDeposit from './pages/PackageDeposit'

// Admin Pages
import AdminLogin from './admin/pages/AdminLogin'
import AdminDashboard from './admin/pages/Dashboard'
import Users from './admin/pages/Users'
import WithdrawRequests from './admin/pages/WithdrawRequests'
import Tasks from './admin/pages/Tasks'
import WalletAdmin from './admin/pages/Wallet'
import Announcements from './admin/pages/Announcements'
import Reports from './admin/pages/Reports'

// Admin Components
import Sidebar from './admin/components/Sidebar'
import Navbar from './admin/components/Navbar'
import './admin/Admin.css'

// Footer
import Footer from './components/Footer'

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const token = localStorage.getItem('token')
  const userRole = localStorage.getItem('userRole')

  // Only check authentication for admin routes
  if (requireAdmin) {
    if (!token || userRole !== 'admin') {
      return <Navigate to="/admin/login" replace />
    }
  }
  
  // For regular user routes, allow access without strict authentication
  // (You can add authentication check here later if needed)
  return children
}

// Admin Redirect Component - redirects to login or dashboard based on auth
const AdminRedirect = () => {
  const token = localStorage.getItem('token')
  const userRole = localStorage.getItem('userRole')

  if (token && userRole === 'admin') {
    return <Navigate to="/admin/dashboard" replace />
  }
  
  return <Navigate to="/admin/login" replace />
}

// Admin Layout Component
const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev)
  }

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false)
  }

  return (
    <div className="admin-wrapper">
      {isSidebarOpen && <div className="sidebar-overlay" onClick={handleCloseSidebar} />}
      <div className="d-flex">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />
        
        {/* Main Content */}
        <div className="main-content">
          <Navbar onToggleSidebar={handleToggleSidebar} />
          <div className="admin-page">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

// App Content Component (to use useLocation hook)
const AppContent = () => {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* User Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/owner-profile" element={<OwnerProfile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/support" element={<Support />} />
        <Route path="/withdraw" element={<Withdraw />} />
        <Route path="/team" element={<Team />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="/official-channel" element={<OfficialChannel />} />
        <Route path="/salary" element={<Salary />} />
        <Route path="/work" element={<Work />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/account-history" element={<AccountHistory />} />
        <Route path="/search-history" element={<SearchHistory />} />
        <Route path="/security-permissions" element={<SecurityPermissions />} />
        <Route path="/accessibility" element={<Accessibility />} />
        <Route path="/help-center" element={<HelpCenter />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/terms-policies" element={<TermsPolicies />} />
        <Route path="/team4stack-profile" element={<Team4StackProfile />} />
        <Route path="/quick-actions" element={<QuickActions />} />
        <Route path="/package-deposit" element={<PackageDeposit />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRedirect />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout>
              <Users />
            </AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/withdraw-requests" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout>
              <WithdrawRequests />
            </AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/tasks" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout>
              <Tasks />
            </AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/wallet" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout>
              <WalletAdmin />
            </AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/announcements" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout>
              <Announcements />
            </AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/reports" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout>
              <Reports />
            </AdminLayout>
          </ProtectedRoute>
        } />

        {/* 404 Route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
