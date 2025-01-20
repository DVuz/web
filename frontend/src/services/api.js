import axios from 'axios';
const baseURL = import.meta.env.VITE_BACKEND_URL;
// Tạo instance của Axios
const api = axios.create({
  baseURL: 'https://192.168.0.102:3000/api',
  withCredentials: true,
});

export default api;
