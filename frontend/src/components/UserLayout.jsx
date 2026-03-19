import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { FiActivity, FiCheckSquare, FiUsers, FiBox, FiUser, FiLogOut, FiAlertTriangle } from 'react-icons/fi'
import './UserLayout.css'

const UserLayout = ({ children }) => {
    const navigate = useNavigate()
    const location = useLocation()

    // Global Logout Guard State
    const [showSidebarLogoutModal, setShowSidebarLogoutModal] = useState(false)

    const isLoggedIn = Boolean(localStorage.getItem('token'))
    const userName = localStorage.getItem('userName') || 'User'
    const rawRole = localStorage.getItem('userRole') || ''
    const isAdmin = rawRole.toLowerCase() === 'admin'
    const displayName = isAdmin ? 'User' : userName

    const handleNavigation = (path) => navigate(path)

    const triggerLogout = () => {
        if (isLoggedIn) {
            setShowSidebarLogoutModal(true)
        } else {
            navigate('/login')
        }
    }

    const confirmGlobalLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('userRole')
        setShowSidebarLogoutModal(false)
        navigate('/login')
    }

    return (
        <div className="user-dashboard-bg">
            <div className="user-dashboard-shell">

                {/* Universal Sidebar - Hidden on mobile, persistent on desktop */}
                <aside className="user-sidebar">
                    <div className="user-sidebar-header">
                        <div className="user-sidebar-welcome-box">
                            <p className="user-sidebar-kicker">Welcome back,</p>
                            <h2 className="user-sidebar-title">{displayName}</h2>
                        </div>
                    </div>

                    <nav className="user-sidebar-nav">
                        <button
                            type="button"
                            className={`user-sidebar-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                            onClick={() => handleNavigation('/dashboard')}
                        >
                            <FiActivity />
                            <span>Overview</span>
                        </button>
                        <button
                            type="button"
                            className={`user-sidebar-link ${location.pathname === '/work' ? 'active' : ''}`}
                            onClick={() => handleNavigation('/work')}
                        >
                            <FiCheckSquare />
                            <span>Tasks</span>
                        </button>
                        <button
                            type="button"
                            className={`user-sidebar-link ${location.pathname === '/team' ? 'active' : ''}`}
                            onClick={() => handleNavigation('/team')}
                        >
                            <FiUsers />
                            <span>Team</span>
                        </button>
                        <button
                            type="button"
                            className={`user-sidebar-link ${location.pathname === '/package-deposit' ? 'active' : ''}`}
                            onClick={() => handleNavigation('/package-deposit')}
                        >
                            <FiBox />
                            <span>Packages</span>
                        </button>
                        <button
                            type="button"
                            className={`user-sidebar-link ${location.pathname === '/profile' ? 'active' : ''}`}
                            onClick={() => handleNavigation('/profile')}
                        >
                            <FiUser />
                            <span>Profile</span>
                        </button>
                        <button
                            type="button"
                            className="user-sidebar-link user-sidebar-auth"
                            onClick={triggerLogout}
                        >
                            <FiLogOut />
                            <span>{isLoggedIn ? 'Logout' : 'Login'}</span>
                        </button>
                    </nav>
                </aside>

                {/* Page Content wrapped alongside sidebar globally */}
                <div className="dashboard-container">
                    {children}
                </div>
            </div>

            {/* Global Logout Modal Guard */}
            <AnimatePresence>
                {showSidebarLogoutModal && (
                    <motion.div
                        className="feature-modal-overlay global-modal-zIndex"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="feature-modal-card logout-card"
                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
                        >
                            <div className="danger-icon-box">
                                <FiAlertTriangle />
                            </div>
                            <h3 className="modal-headline text-white mt-3" style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>Terminate Session?</h3>
                            <p className="modal-subtext" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', margin: '0.5rem 0 1.5rem' }}>
                                You are about to log out globally. You must re-authenticate to view your earnings matrix. Let's stack blocks!
                            </p>

                            <div className="modal-action-row" style={{ display: 'flex', gap: '1rem' }}>
                                <button
                                    style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', cursor: 'pointer' }}
                                    onClick={() => setShowSidebarLogoutModal(false)}
                                >
                                    Stay
                                </button>
                                <button
                                    style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', background: '#ef4444', border: 'none', color: '#fff', cursor: 'pointer', boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)' }}
                                    onClick={confirmGlobalLogout}
                                >
                                    Log Out
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    )
}

export default UserLayout
