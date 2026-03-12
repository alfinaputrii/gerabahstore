// src/api/endpoints.js
import api from "./axios";

// ===== PRODUCT ENDPOINTS =====
export const productAPI = {
  // Get all products
  getAll: () => api.get("/products"),

  // Get single product by ID
  getById: (id) => api.get(`/products/${id}`),

  // Get featured products (limit 6)
  getFeatured: () => api.get("/products?limit=6"),

  // Get best selling products (dummy, filter di frontend)
  getBestSelling: () => api.get("/products"),
};

// ===== CATEGORY ENDPOINTS =====
export const categoryAPI = {
  getAll: () => api.get("/categories"),
  getById: (id) => api.get(`/categories/${id}`),
};

// ===== USER ENDPOINTS =====
export const userAPI = {
  // Get current user profile
  getProfile: () => api.get("/users/profile"),

  // ===== TAMBAHAN UNTUK CUSTOMER =====
  // Get all customers (role = customer)
  getAllCustomers: () => api.get("/users?role=customer"),

  // Search customers by name or email
  searchCustomers: (search) => api.get(`/users?role=customer&search=${search}`),

  // Get customer by ID
  getCustomerById: (id) => api.get(`/users/${id}`),
};

// ===== TRANSACTION ENDPOINTS =====
export const transactionAPI = {
  // Buat transaksi baru
  create: (data) => api.post("/transactions", data),

  // Ambil riwayat transaksi kasir tertentu
  getByCashier: (cashierId) => api.get(`/transactions/cashier/${cashierId}`),

  // Ambil detail transaksi berdasarkan ID
  getById: (id) => api.get(`/transactions/${id}`),
};

// ===== AUTH CHECK =====
export const checkAuth = () => {
  return localStorage.getItem("token") !== null;
};

export const getUserData = () => {
  const userData = localStorage.getItem("user");
  if (userData) {
    try {
      return JSON.parse(userData);
    } catch (error) {
      return null;
    }
  }
  return null;
};
