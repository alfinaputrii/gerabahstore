// src/layouts/KasirLayout.jsx
import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  History,
  User,
  Settings,
  LogOut,
  Menu,
  UserCircle,
} from "lucide-react";

const KasirLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user.name || "Kasir";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path;
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

        {/* MENU NAVIGASI KASIR - SEKARANG PAKAI admin-button */}
        <nav className="flex-1 py-4">
          {/* POS */}
          <button
            onClick={() => navigate("/kasir")}
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
              ${isActive("/kasir") ? "text-soft-brown-700" : ""}
            `}
          >
            {isActive("/kasir") && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-soft-brown-600 rounded-r"></div>
            )}
            <LayoutDashboard
              size={20}
              className={
                isActive("/kasir") ? "text-soft-brown-700" : "text-gray-500"
              }
            />
            {sidebarOpen && <span className="ml-4">POS</span>}
          </button>

          {/* Riwayat */}
          <button
            onClick={() => navigate("/kasir/riwayat")}
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
              ${isActive("/kasir/riwayat") ? "text-soft-brown-700" : ""}
            `}
          >
            {isActive("/kasir/riwayat") && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-soft-brown-600 rounded-r"></div>
            )}
            <History
              size={20}
              className={
                isActive("/kasir/riwayat")
                  ? "text-soft-brown-700"
                  : "text-gray-500"
              }
            />
            {sidebarOpen && <span className="ml-4">Riwayat</span>}
          </button>

          {/* Profile */}
          <button
            onClick={() => navigate("/kasir/profile")}
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
              ${isActive("/kasir/profile") ? "text-soft-brown-700" : ""}
            `}
          >
            {isActive("/kasir/profile") && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-soft-brown-600 rounded-r"></div>
            )}
            <User
              size={20}
              className={
                isActive("/kasir/profile")
                  ? "text-soft-brown-700"
                  : "text-gray-500"
              }
            />
            {sidebarOpen && <span className="ml-4">Profile</span>}
          </button>

          {/* Settings */}
          <button
            onClick={() => navigate("/kasir/settings")}
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
              ${isActive("/kasir/settings") ? "text-soft-brown-700" : ""}
            `}
          >
            {isActive("/kasir/settings") && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-soft-brown-600 rounded-r"></div>
            )}
            <Settings
              size={20}
              className={
                isActive("/kasir/settings")
                  ? "text-soft-brown-700"
                  : "text-gray-500"
              }
            />
            {sidebarOpen && <span className="ml-4">Settings</span>}
          </button>
        </nav>

        {/* Logout Button */}
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
                Dashboard Kasir
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

export default KasirLayout;
