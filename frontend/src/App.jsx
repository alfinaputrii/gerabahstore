// src/App.jsx - UPDATE INI
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./pages/auth/Login";
import CustomerDashboard from "./pages/customer/Dashboard";
import Products from "./pages/customer/Products";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

// IMPORT ADMIN LAYOUT & PAGES (yang akan kita buat)
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/products/Products";

// IMPORT PROTECTED ROUTE (yang baru saja kita buat)
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

// Komponen placeholder untuk halaman yang belum ada
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
    // Cek apakah user sudah login
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
      <div className="app">
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/login" element={<Login />} />

          {/* ========== CUSTOMER ROUTES (Navbar di ATAS) ========== */}
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

          {/* ========== ADMIN ROUTES (Sidebar di SAMPING) ========== */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            {/* Halaman-halaman admin akan dirender di dalam AdminLayout */}
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route
              path="orders"
              element={<ComingSoonPage title="Kelola Pesanan" />}
            />
            <Route
              path="customers"
              element={<ComingSoonPage title="Kelola Pelanggan" />}
            />
            <Route
              path="settings"
              element={<ComingSoonPage title="Pengaturan" />}
            />
          </Route>

          {/* DEFAULT ROUTE - Redirect berdasarkan role */}
          <Route
            path="/"
            element={
              userRole === "admin" ? (
                <Navigate to="/admin" replace />
              ) : userRole === "customer" ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* 404 NOT FOUND */}
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
