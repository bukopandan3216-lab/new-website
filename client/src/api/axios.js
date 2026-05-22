import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
import axios from 'axios'

export default axios.create({
  baseURL: 'https://your-backend.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
})


axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('thefarmers_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default axiosClient
