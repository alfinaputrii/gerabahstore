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
  getProfile: () => api.get("/users/profile"),
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
