// src/api/axios.js
import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// AUTO BAWA TOKEN
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// HANDLE RESPONSE ERROR (TERMASUK TOKEN EXPIRED)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    
    // Kalau error 401 (Unauthorized) atau 403 (Forbidden) karena token expired
    if (error.response?.status === 401 || 
        (error.response?.status === 403 && 
         error.response?.data?.message?.includes("kedaluwarsa"))) {
        
      if (originalRequest.url === '/auth/login') {
        return Promise.reject(error);
      }
      
      // Hapus token & user dari localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      // Redirect ke login
      window.location.href = "/login";
      
      // Kasih tahu user
      toast.error("Sesi telah berakhir. Silakan login kembali.");
    }
    
    return Promise.reject(error);
  }
);

export default api;