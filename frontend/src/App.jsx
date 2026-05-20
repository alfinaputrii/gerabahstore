// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// ========== CUSTOMER REDESIGN (BARU) ==========
import { CartProvider } from "./context/CartContext";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./pages/customer/Home";
import ProductListing from "./pages/customer/ProductListing";
import ProductDetail from "./pages/customer/ProductDetail";
import Cart from "./pages/customer/Cart";
import Checkout from "./pages/customer/Checkout";
import OrderConfirmation from "./pages/customer/OrderConfirmation";
import About from "./pages/customer/About";
import Contact from "./pages/customer/Contact";
import Profile from "./pages/customer/Profile";
import MyOrders from "./pages/customer/MyOrders";

// Admin Imports
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/products/Products";
import AdminCategories from "./pages/admin/categories/Categories";
import AdminOrders from "./pages/admin/orders/Orders";
import AdminUsers from "./pages/admin/users/Users";
import AdminSettings from "./pages/admin/settings/Settings";
import CreateStaff from "./pages/admin/CreateStaff";

// Kasir Imports
import KasirLayout from "./layouts/KasirLayout";
import PosPage from "./pages/kasir/Pos";
import KasirRiwayat from "./pages/kasir/Riwayat";
import KasirProfile from "./pages/kasir/Profile";
import KasirSettings from "./pages/kasir/Settings";

import ProtectedRoute from "./components/ProtectedRoute";

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
      <CartProvider>
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
            <Route path="/register" element={<Register />} />

            {/* ========== CUSTOMER ROUTES (REDESIGN) ========== */}
            <Route
              path="/"
              element={
                <ProtectedRoute allowedRoles={["customer"]}>
                  <div className="customer-page min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-1">
                      <Outlet />
                    </main>
                    <Footer />
                  </div>
                </ProtectedRoute>
              }
            >
              <Route index element={<Home />} />
              <Route path="shop" element={<ProductListing />} />
              <Route path="product/:id" element={<ProductDetail />} />
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route
                path="order-confirmation"
                element={<OrderConfirmation />}
              />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              // Di dalam CUSTOMER ROUTES (REDESIGN)
              <Route path="profile" element={<Profile />} />
              <Route path="my-orders" element={<MyOrders />} />
            </Route>

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
              <Route path="users/create" element={<CreateStaff />} />
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
                        window.location.href = "/";
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
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;