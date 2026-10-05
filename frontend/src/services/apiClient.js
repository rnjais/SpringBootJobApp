import axios from 'axios';
const apiClient = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api/v1', headers: { 'Content-Type': 'application/json' } });
apiClient.interceptors.request.use(config => { const token = localStorage.getItem('token'); if (token) config.headers.Authorization = `Bearer ${token}`; return config; });
apiClient.interceptors.response.use(r => r, error => { if (error.response?.status === 401) { localStorage.removeItem('token'); localStorage.removeItem('user'); if (window.location.pathname !== '/login') window.dispatchEvent(new Event('auth:expired')); } return Promise.reject(error); });
export default apiClient;
