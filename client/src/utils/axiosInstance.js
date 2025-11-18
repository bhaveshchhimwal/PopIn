import axios from 'axios';

const isLocalhost = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1';

const axiosInstance = axios.create({
  baseURL: isLocalhost 
    ? 'http://localhost:8080/api' 
    : 'https://popin-evz9.onrender.com/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

export default axiosInstance;