import axios from 'axios'

// BAAD MEIN
const api = axios.create({ 
  baseURL: 'https://obgyne-backend.onrender.com/api',
  withCredentials: true 
})
//  https://obgyne-backend.onrender.com/api
//  http://localhost:5000/api
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
