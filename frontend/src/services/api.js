import axios from 'axios'

const api = axios.create({
  // Use Vite dev proxy (see `vite.config.js`) so we always hit the backend on the correct port.
  baseURL: '/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api

