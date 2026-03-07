// src/layouts/AdminLayout.jsx
import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  Menu,
  UserCircle,
  ChevronDown,
  Grid3x3, // <-- ICON UNTUK DAFTAR PRODUK
  Tag, // <-- ICON UNTUK KATEGORI
} from "lucide-react";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [productsOpen, setProductsOpen] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user.name || "Admin";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isProductsActive = () => {
    return (
      location.pathname.startsWith("/admin/products") ||
      location.pathname.startsWith("/admin/categories")
    );
  };

  return (
    <div className="min-h-screen bg-soft-brown-50 flex">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "w-64" : "w-20"} bg-white shadow-lg transition-all duration-300 flex flex-col border-r border-soft-brown-200`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-soft-brown-200">
          <div
            className={`flex items-center ${!sidebarOpen ? "justify-center" : "space-x-2"}`}
          >
            <div className="w-8 h-8 bg-soft-brown-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              BR
            </div>
            {sidebarOpen && (
              <span className="font-semibold text-soft-brown-700 text-sm tracking-wide">
                Bhumika Rupa
              </span>
            )}
          </div>
        </div>

        {/* MENU NAVIGASI - TANPA BACKGROUND SAAT HOVER */}
        <nav className="flex-1 py-4">
          {/* Dashboard */}
          <button
            onClick={() => navigate("/admin")}
            className={`
              admin-button 
              w-full 
              flex 
              items-center 
              px-4 
              py-3 
              transition-colors 
              relative
              bg-white
              text-gray-600
              hover:text-gray-900
              ${isActive("/admin") ? "text-soft-brown-700" : ""}
            `}
          >
            {isActive("/admin") && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-soft-brown-600 rounded-r"></div>
            )}
            <LayoutDashboard
              size={20}
              className={
                isActive("/admin") ? "text-soft-brown-700" : "text-gray-500"
              }
            />
            {sidebarOpen && <span className="ml-4">Dashboard</span>}
          </button>

          {/* Produk dengan Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProductsOpen(!productsOpen)}
              className={`
                admin-button 
                w-full 
                flex 
                items-center 
                justify-between
                px-4 
                py-3 
                transition-colors 
                bg-white
                text-gray-600
                hover:text-gray-900
                ${isProductsActive() ? "text-soft-brown-700" : ""}
              `}
            >
              <div className="flex items-center">
                <Package
                  size={20}
                  className={
                    isProductsActive() ? "text-soft-brown-700" : "text-gray-500"
                  }
                />
                {sidebarOpen && <span className="ml-4">Produk</span>}
              </div>
              {sidebarOpen && (
                <ChevronDown
                  size={16}
                  className={`transform transition-transform ${productsOpen ? "rotate-180" : ""} ${
                    isProductsActive() ? "text-soft-brown-700" : "text-gray-500"
                  }`}
                />
              )}
            </button>

            {/* Submenu - muncul jika sidebarOpen dan productsOpen true */}
            {sidebarOpen && productsOpen && (
              <div className="bg-white">
                {/* Daftar Produk */}
                <button
                  onClick={() => navigate("/admin/products")}
                  className={`
                    admin-button 
                    w-full 
                    flex 
                    items-center 
                    pl-12
                    pr-4 
                    py-2 
                    transition-colors 
                    bg-white
                    text-gray-600
                    hover:text-gray-900
                    text-sm
                    ${isActive("/admin/products") ? "text-soft-brown-700" : ""}
                  `}
                >
                  {isActive("/admin/products") && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-soft-brown-600 rounded-r"></div>
                  )}
                  <Grid3x3
                    size={16}
                    className={`mr-2 ${isActive("/admin/products") ? "text-soft-brown-700" : "text-gray-500"}`}
                  />
                  Daftar Produk
                </button>

                {/* Kategori */}
                <button
                  onClick={() => navigate("/admin/categories")}
                  className={`
                    admin-button 
                    w-full 
                    flex 
                    items-center 
                    pl-12
                    pr-4 
                    py-2 
                    transition-colors 
                    bg-white
                    text-gray-600
                    hover:text-gray-900
                    text-sm
                    ${isActive("/admin/categories") ? "text-soft-brown-700" : ""}
                  `}
                >
                  {isActive("/admin/categories") && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-soft-brown-600 rounded-r"></div>
                  )}
                  <Tag
                    size={16}
                    className={`mr-2 ${isActive("/admin/categories") ? "text-soft-brown-700" : "text-gray-500"}`}
                  />
                  Kategori
                </button>
              </div>
            )}
          </div>

          {/* Pesanan */}
          <button
            onClick={() => navigate("/admin/orders")}
            className={`
              admin-button 
              w-full 
              flex 
              items-center 
              px-4 
              py-3 
              transition-colors 
              relative
              bg-white
              text-gray-600
              hover:text-gray-900
              ${isActive("/admin/orders") ? "text-soft-brown-700" : ""}
            `}
          >
            {isActive("/admin/orders") && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-soft-brown-600 rounded-r"></div>
            )}
            <ShoppingCart
              size={20}
              className={
                isActive("/admin/orders")
                  ? "text-soft-brown-700"
                  : "text-gray-500"
              }
            />
            {sidebarOpen && <span className="ml-4">Pesanan</span>}
          </button>

          {/* Users */}
          <button
            onClick={() => navigate("/admin/users")}
            className={`
              admin-button 
              w-full 
              flex 
              items-center 
              px-4 
              py-3 
              transition-colors 
              relative
              bg-white
              text-gray-600
              hover:text-gray-900
              ${isActive("/admin/users") ? "text-soft-brown-700" : ""}
            `}
          >
            {isActive("/admin/users") && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-soft-brown-600 rounded-r"></div>
            )}
            <Users
              size={20}
              className={
                isActive("/admin/users")
                  ? "text-soft-brown-700"
                  : "text-gray-500"
              }
            />
            {sidebarOpen && <span className="ml-4">Users</span>}
          </button>

          {/* Pengaturan */}
          <button
            onClick={() => navigate("/admin/settings")}
            className={`
              admin-button 
              w-full 
              flex 
              items-center 
              px-4 
              py-3 
              transition-colors 
              relative
              bg-white
              text-gray-600
              hover:text-gray-900
              ${isActive("/admin/settings") ? "text-soft-brown-700" : ""}
            `}
          >
            {isActive("/admin/settings") && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-soft-brown-600 rounded-r"></div>
            )}
            <Settings
              size={20}
              className={
                isActive("/admin/settings")
                  ? "text-soft-brown-700"
                  : "text-gray-500"
              }
            />
            {sidebarOpen && <span className="ml-4">Pengaturan</span>}
          </button>
        </nav>

        {/* Logout Button - TETAP DENGAN BACKGROUND COKLAT SAAT HOVER */}
        <div className="p-4 border-t border-soft-brown-200">
          <button
            onClick={handleLogout}
            className="admin-button w-full flex items-center px-4 py-3 bg-white text-gray-600 hover:bg-soft-brown-700 hover:text-white transition-colors rounded-lg"
          >
            <LogOut size={20} className="text-gray-500" />
            {sidebarOpen && <span className="ml-4">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm py-3 px-6 border-b border-soft-brown-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="admin-button p-2 bg-white text-gray-600 hover:bg-soft-brown-700 hover:text-white rounded-lg transition-colors"
              >
                <Menu size={20} />
              </button>
              <h1 className="text-lg font-medium text-gray-800">
                Dashboard Admin
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <UserCircle size={24} className="text-soft-brown-600" />
                <span className="text-sm font-medium text-gray-700">
                  {userName}
                </span>
              </div>
            </div>
          </div>
        </header>
        <div className="flex-1 p-6 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
