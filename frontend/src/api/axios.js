// src/api/axios.js
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

console.log("🚀 API Base URL:", BASE_URL);

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("🔑 Token attached untuk:", config.url);
  }
  return config;
});

// ============================================
// 3. HANDLE RESPONSE ERROR
// ============================================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    
    // Log error biar tau
    console.log("❌ Error response:", {
      url: originalRequest?.url,
      status: error.response?.status,
      message: error.response?.data?.message
    });
    
    // Kalau error 401 (Unauthorized) atau 403 (Forbidden) karena token expired
    if (error.response?.status === 401 || 
        (error.response?.status === 403 && 
         error.response?.data?.message?.includes("kedaluwarsa"))) {
        
      // Jangan redirect kalau lagi di halaman login
      if (originalRequest.url === '/auth/login') {
        return Promise.reject(error);
      }
      
      console.log("⏰ Token expired, redirect ke login...");
      
      // Hapus token & user dari localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      // Kasih tahu user
      toast.error("Sesi telah berakhir. Silakan login kembali.");
      
      // Redirect ke login (kasih jeda biar toast kebaca)
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    }
    
    return Promise.reject(error);
  }
);

export default api;