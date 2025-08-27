import axios from 'axios'

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  timeout: 10000,
})

// Attach token from localStorage (simple dev approach)
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('tt_access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

http.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(new Error(err.response?.data?.message || err.message))
)
