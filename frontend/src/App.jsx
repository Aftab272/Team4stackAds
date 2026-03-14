import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
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
import './App.css'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<UserProfile />} />
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
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
