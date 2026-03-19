import axios from 'axios'

// Create axios instance for admin API calls
const adminApi = axios.create({
  // Use Vite dev proxy so it always points to the backend running on 5000
  baseURL: '/api/admin',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Handle response errors
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Token expired or invalid - redirect to login
      localStorage.removeItem('token')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

// Dashboard APIs
export const getDashboardStats = () => adminApi.get('/dashboard')

// User Management APIs
export const getAllUsers = (params = {}) => adminApi.get('/users', { params })
export const getUserById = (id) => adminApi.get(`/users/${id}`)
export const updateUserStatus = (id, status) => 
  adminApi.put(`/users/${id}/status`, { status })
export const deleteUser = (id) => adminApi.delete(`/users/${id}`)

// Withdrawal Management APIs
export const getAllWithdrawRequests = (params = {}) => 
  adminApi.get('/withdraw', { params })
export const approveWithdrawal = (id) => 
  adminApi.post(`/withdraw/${id}`, { action: 'approve' })
export const rejectWithdrawal = (id, reason) => 
  adminApi.post(`/withdraw/${id}`, { action: 'reject', reason })

// Task Management APIs
export const getAllTasks = (params = {}) => adminApi.get('/tasks', { params })
export const createTask = (taskData) => adminApi.post('/tasks', taskData)
export const updateTask = (id, taskData) => adminApi.put(`/tasks/${id}`, taskData)
export const deleteTask = (id) => adminApi.delete(`/tasks/${id}`)

// Wallet Management APIs
export const getAllWalletTransactions = (params = {}) => 
  adminApi.get('/wallet', { params })
export const getWalletStatistics = () => adminApi.get('/wallet?action=statistics')
export const adjustUserBalance = (userId, data) => 
  adminApi.post(`/wallet/${userId}/adjust`, data)

// Announcement Management APIs
export const getAllAnnouncements = (params = {}) => 
  adminApi.get('/announcements', { params })
export const createAnnouncement = (announcementData) => 
  adminApi.post('/announcements', announcementData)
export const updateAnnouncement = (id, announcementData) => 
  adminApi.put(`/announcements/${id}`, announcementData)
export const deleteAnnouncement = (id) => adminApi.delete(`/announcements/${id}`)

// Reports & Analytics APIs
export const getReports = (type = 'overview', params = {}) => 
  adminApi.get(`/reports?type=${type}`, { params })

// Membership APIs
export const getAllMemberships = () => adminApi.get('/memberships')
export const createMembership = (data) => adminApi.post('/memberships', data)
export const updateMembership = (id, data) => adminApi.put(`/memberships/${id}`, data)
export const deleteMembership = (id) => adminApi.delete(`/memberships/${id}`)

// Payments APIs
export const getAllPayments = (params = {}) => adminApi.get('/payments', { params })
export const approvePayment = (id) => adminApi.post(`/payments/${id}/approve`)
export const rejectPayment = (id, reason) => adminApi.post(`/payments/${id}/reject`, { reason })

// Ads APIs
export const getAllAds = () => adminApi.get('/ads')
export const createAd = (data) => adminApi.post('/ads', data)
export const updateAd = (id, data) => adminApi.put(`/ads/${id}`, data)
export const deleteAd = (id) => adminApi.delete(`/ads/${id}`)

export default adminApi
