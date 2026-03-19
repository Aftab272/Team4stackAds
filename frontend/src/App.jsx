import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'
import { ToastContainer } from 'react-toastify'

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
import Login from './pages/Login'
import Register from './pages/Register'

// Admin Pages
import AdminLogin from './admin/pages/AdminLogin'
import AdminDashboard from './admin/pages/Dashboard'
import Users from './admin/pages/Users'
import WithdrawRequests from './admin/pages/WithdrawRequests'
import Tasks from './admin/pages/Tasks'
import WalletAdmin from './admin/pages/Wallet'
import Announcements from './admin/pages/Announcements'
import Reports from './admin/pages/Reports'
import Memberships from './admin/pages/Memberships'
import Payments from './admin/pages/Payments'
import Ads from './admin/pages/Ads'

// Admin Components
import Sidebar from './admin/components/Sidebar'
import Navbar from './admin/components/Navbar'
import './admin/Admin.css'

// Footer
import Footer from './components/Footer'

// Layout wrapper for user dashboard pages
import UserLayout from './components/UserLayout'

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const token = localStorage.getItem('token')
  const userRole = localStorage.getItem('userRole')

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (requireAdmin && userRole !== 'admin') {
    return <Navigate to="/admin/login" replace />
  }

  if (!requireAdmin) {
    return <UserLayout>{children}</UserLayout>
  }

  return children
}

const HomeRedirect = () => {
  const token = localStorage.getItem('token')
  return token ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
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
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register'

  return (
    <>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        } />

        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
        <Route path="/support" element={
          <ProtectedRoute>
            <Support />
          </ProtectedRoute>
        } />
        <Route path="/withdraw" element={
          <ProtectedRoute>
            <Withdraw />
          </ProtectedRoute>
        } />
        <Route path="/team" element={
          <ProtectedRoute>
            <Team />
          </ProtectedRoute>
        } />
        <Route path="/guide" element={
          <ProtectedRoute>
            <Guide />
          </ProtectedRoute>
        } />
        <Route path="/official-channel" element={
          <ProtectedRoute>
            <OfficialChannel />
          </ProtectedRoute>
        } />
        <Route path="/salary" element={
          <ProtectedRoute>
            <Salary />
          </ProtectedRoute>
        } />
        <Route path="/work" element={
          <ProtectedRoute>
            <Work />
          </ProtectedRoute>
        } />
        <Route path="/about" element={
          <ProtectedRoute>
            <AboutUs />
          </ProtectedRoute>
        } />
        <Route path="/contact" element={
          <ProtectedRoute>
            <ContactUs />
          </ProtectedRoute>
        } />
        <Route path="/wallet" element={
          <ProtectedRoute>
            <Wallet />
          </ProtectedRoute>
        } />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/account-history" element={
          <ProtectedRoute>
            <AccountHistory />
          </ProtectedRoute>
        } />
        <Route path="/search-history" element={
          <ProtectedRoute>
            <SearchHistory />
          </ProtectedRoute>
        } />
        <Route path="/security-permissions" element={
          <ProtectedRoute>
            <SecurityPermissions />
          </ProtectedRoute>
        } />
        <Route path="/accessibility" element={
          <ProtectedRoute>
            <Accessibility />
          </ProtectedRoute>
        } />
        <Route path="/help-center" element={
          <ProtectedRoute>
            <HelpCenter />
          </ProtectedRoute>
        } />
        <Route path="/notifications" element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        } />
        <Route path="/terms-policies" element={
          <ProtectedRoute>
            <TermsPolicies />
          </ProtectedRoute>
        } />
        <Route path="/team4stack-profile" element={
          <ProtectedRoute>
            <Team4StackProfile />
          </ProtectedRoute>
        } />
        <Route path="/quick-actions" element={
          <ProtectedRoute>
            <QuickActions />
          </ProtectedRoute>
        } />
        <Route path="/package-deposit" element={
          <ProtectedRoute>
            <PackageDeposit />
          </ProtectedRoute>
        } />

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
        <Route path="/admin/memberships" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout>
              <Memberships />
            </AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/payments" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout>
              <Payments />
            </AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/ads" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout>
              <Ads />
            </AdminLayout>
          </ProtectedRoute>
        } />

        {/* 404 Route */}
        <Route path="*" element={<HomeRedirect />} />
      </Routes>
      {!isAdminRoute && !isAuthRoute && <Footer />}
      <ToastContainer
        position="top-right"
        autoClose={3200}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="dark"
      />
    </>
  )
}

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AppContent />
    </Router>
  )
}

export default App
