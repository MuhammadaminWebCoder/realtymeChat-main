import axios from "axios";

// Tokenni localStorage-dan olish
const token = localStorage.getItem("accessToken");

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

export default axiosInstance;
