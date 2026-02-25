// src/api/dashboard.js
import api from "./axios"; // <-- import api (bukan API)

// GET /dashboard/summary - Ambil semua data dashboard
export const getDashboardSummary = async () => {
  try {
    const response = await api.get("/dashboard/summary");
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    throw error;
  }
};

// GET /dashboard/daily-sales?days=7 - Grafik penjualan harian
export const getDailySales = async (days = 7) => {
  try {
    const response = await api.get(`/dashboard/daily-sales?days=${days}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching daily sales:", error);
    throw error;
  }
};

// GET /dashboard/top-products?limit=5 - Produk terlaris
export const getTopProducts = async (limit = 5) => {
  try {
    const response = await api.get(`/dashboard/top-products?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching top products:", error);
    throw error;
  }
};

// GET /dashboard/low-stock?threshold=5 - Stok hampir habis
export const getLowStock = async (threshold = 5) => {
  try {
    const response = await api.get(
      `/dashboard/low-stock?threshold=${threshold}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching low stock:", error);
    throw error;
  }
};

// GET /dashboard/latest-orders?limit=5 - Pesanan terbaru
export const getLatestOrders = async (limit = 5) => {
  try {
    const response = await api.get(`/dashboard/latest-orders?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching latest orders:", error);
    throw error;
  }
};
