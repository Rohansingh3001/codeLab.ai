import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // This should resolve to "http://localhost:3000"
  headers: {
    "Authorization": `Bearer ${localStorage.getItem('token')}`
  },
});

export default axiosInstance;
