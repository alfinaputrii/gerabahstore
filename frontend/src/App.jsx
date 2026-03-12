// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register"; // <-- IMPORT REGISTER
import CustomerDashboard from "./pages/customer/Dashboard";
import Products from "./pages/customer/Products";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

// Admin Imports
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/products/Products";
import AdminCategories from "./pages/admin/categories/Categories";
import AdminOrders from "./pages/admin/orders/Orders";
import AdminUsers from "./pages/admin/users/Users";
import AdminSettings from "./pages/admin/settings/Settings";
import CreateStaff from "./pages/admin/CreateStaff"; // <-- IMPORT CREATE STAFF

// Kasir Imports
import KasirLayout from "./layouts/KasirLayout";
import PosPage from "./pages/kasir/Pos";
import KasirRiwayat from "./pages/kasir/Riwayat";
import KasirProfile from "./pages/kasir/Profile";
import KasirSettings from "./pages/kasir/Settings";

import ProtectedRoute from "./components/ProtectedRoute";

import "./pages/customer/Dashboard.css";
import "./components/layout/Header.css";
import "./components/layout/Footer.css";

const Layout = ({ children }) => {
  return (
    <div className="app-layout">
      <Header />
      <main className="main-content">{children}</main>
      <Footer />
    </div>
  );
};

const ComingSoonPage = ({ title }) => (
  <div
    style={{
      padding: "40px 20px",
      textAlign: "center",
      minHeight: "60vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <h1 style={{ color: "#8B4513", marginBottom: "20px" }}>{title}</h1>
    <p style={{ marginBottom: "30px", color: "#666" }}>
      Halaman ini sedang dalam pengembangan
    </p>
    <button
      onClick={() => (window.location.href = "/dashboard")}
      style={{
        padding: "12px 24px",
        background: "#8B4513",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600",
      }}
    >
      Kembali ke Dashboard
    </button>
  </div>
);

function App() {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (userData && token) {
      try {
        const parsedUser = JSON.parse(userData);
        setUserRole(parsedUser.role);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Memuat aplikasi...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#fff",
            color: "#363636",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            border: "1px solid #E6D5B8",
          },
          success: {
            iconTheme: {
              primary: "#A67B5B",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />

      <div className="app">
        <Routes>
          {/* ========== PUBLIC ROUTES ========== */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />{" "}
          {/* <-- TAMBAHKAN INI */}
          {/* ========== CUSTOMER ROUTES ========== */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <Layout>
                  <CustomerDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/products"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <Layout>
                  <Products />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/categories"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <Layout>
                  <ComingSoonPage title="Kategori" />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/categories/:id"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <Layout>
                  <ComingSoonPage title="Detail Kategori" />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/products/:id"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <Layout>
                  <ComingSoonPage title="Detail Produk" />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/promo"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <Layout>
                  <ComingSoonPage title="Promo" />
                </Layout>
              </ProtectedRoute>
            }
          />
          {/* ========== ADMIN ROUTES ========== */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="users/create" element={<CreateStaff />} />{" "}
            {/* <-- TAMBAHKAN INI */}
            <Route path="settings" element={<AdminSettings />} />
          </Route>
          {/* ========== KASIR ROUTES ========== */}
          <Route
            path="/kasir"
            element={
              <ProtectedRoute allowedRoles={["cashier"]}>
                <KasirLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<PosPage />} />
            <Route path="riwayat" element={<KasirRiwayat />} />
            <Route path="profile" element={<KasirProfile />} />
            <Route path="settings" element={<KasirSettings />} />
          </Route>
          {/* ========== DEFAULT ROUTE ========== */}
          <Route
            path="/"
            element={
              userRole === "admin" ? (
                <Navigate to="/admin" replace />
              ) : userRole === "cashier" ? (
                <Navigate to="/kasir" replace />
              ) : userRole === "customer" ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          {/* ========== 404 NOT FOUND ========== */}
          <Route
            path="*"
            element={
              <div
                style={{
                  textAlign: "center",
                  padding: "50px",
                  minHeight: "100vh",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <h1>404 - Halaman Tidak Ditemukan</h1>
                <p>Halaman yang Anda cari tidak ada.</p>
                <button
                  onClick={() => {
                    if (userRole === "admin") {
                      window.location.href = "/admin";
                    } else if (userRole === "cashier") {
                      window.location.href = "/kasir";
                    } else {
                      window.location.href = "/dashboard";
                    }
                  }}
                  style={{
                    padding: "10px 20px",
                    background: "#8B4513",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    marginTop: "20px",
                  }}
                >
                  Kembali ke Beranda
                </button>
              </div>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
