import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // ganti kalau backend beda
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

export default api;