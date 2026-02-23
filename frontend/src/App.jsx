// src/App.jsx - UPDATE INI
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./pages/auth/Login";
import CustomerDashboard from "./pages/customer/Dashboard";
import Products from "./pages/customer/Products"; // ✅ TAMBAHKAN IMPORT INI
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
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

          {/* CUSTOMER ROUTES */}
          <Route
            path="/dashboard"
            element={
              userRole === "customer" ? (
                <Layout>
                  <CustomerDashboard />
                </Layout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* ✅ TAMBAHKAN ROUTE UNTUK HALAMAN CUSTOMER */}
          <Route
            path="/customer/products"
            element={
              userRole === "customer" ? (
                <Layout>
                  <Products /> {/* ✅ GANTI ComingSoonPage dengan Products */}
                </Layout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/customer/categories"
            element={
              userRole === "customer" ? (
                <Layout>
                  <ComingSoonPage title="Kategori" />
                </Layout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/customer/categories/:id"
            element={
              userRole === "customer" ? (
                <Layout>
                  <ComingSoonPage title="Detail Kategori" />
                </Layout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/customer/products/:id"
            element={
              userRole === "customer" ? (
                <Layout>
                  <ComingSoonPage title="Detail Produk" />
                </Layout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/customer/promo"
            element={
              userRole === "customer" ? (
                <Layout>
                  <ComingSoonPage title="Promo" />
                </Layout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* DEFAULT ROUTE */}
          <Route
            path="/"
            element={
              userRole === "customer" ? (
                <Navigate to="/dashboard" />
              ) : (
                <Navigate to="/login" />
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
                  onClick={() => (window.location.href = "/dashboard")}
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
                  Kembali ke Dashboard
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
