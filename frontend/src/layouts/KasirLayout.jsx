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
import bgImage from "../assets/bg.jpg";

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
    <div
      className="min-h-screen w-full bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="min-h-screen bg-black/30 flex">
        {/* SIDEBAR - LEBAR + ICON BESAR */}
        <aside
          className={`${sidebarOpen ? "w-72" : "w-24"} bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-soft-brown-200 m-4 h-fit sticky top-6`}
        >
          {/* Logo BR */}
          <div className="py-8 flex justify-center">
            <div className="w-14 h-14 bg-soft-brown-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
              BR
            </div>
          </div>

          {/* MENU - ICON BESAR BANGET */}
          <nav className="px-4 space-y-2">
            <button
              onClick={() => navigate("/kasir")}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-colors ${
                isActive("/kasir")
                  ? "bg-soft-brown-100 text-soft-brown-700 font-medium"
                  : "text-gray-700 hover:bg-soft-brown-50 hover:text-soft-brown-600"
              }`}
            >
              <LayoutDashboard size={28} />
              {sidebarOpen && (
                <span className="text-base font-medium">POS</span>
              )}
            </button>

            <button
              onClick={() => navigate("/kasir/riwayat")}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-colors ${
                isActive("/kasir/riwayat")
                  ? "bg-soft-brown-100 text-soft-brown-700 font-medium"
                  : "text-gray-700 hover:bg-soft-brown-50 hover:text-soft-brown-600"
              }`}
            >
              <History size={28} />
              {sidebarOpen && (
                <span className="text-base font-medium">Riwayat</span>
              )}
            </button>

            <button
              onClick={() => navigate("/kasir/profile")}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-colors ${
                isActive("/kasir/profile")
                  ? "bg-soft-brown-100 text-soft-brown-700 font-medium"
                  : "text-gray-700 hover:bg-soft-brown-50 hover:text-soft-brown-600"
              }`}
            >
              <User size={28} />
              {sidebarOpen && (
                <span className="text-base font-medium">Profile</span>
              )}
            </button>

            <button
              onClick={() => navigate("/kasir/settings")}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-colors ${
                isActive("/kasir/settings")
                  ? "bg-soft-brown-100 text-soft-brown-700 font-medium"
                  : "text-gray-700 hover:bg-soft-brown-50 hover:text-soft-brown-600"
              }`}
            >
              <Settings size={28} />
              {sidebarOpen && (
                <span className="text-base font-medium">Settings</span>
              )}
            </button>
          </nav>

          {/* Logout */}
          <div className="p-4 mt-6 border-t border-soft-brown-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-gray-700 hover:bg-red-50 hover:text-red-500 transition-colors"
            >
              <LogOut size={28} />
              {sidebarOpen && (
                <span className="text-base font-medium">Logout</span>
              )}
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white/95 backdrop-blur-sm shadow-sm py-4 px-6 rounded-2xl m-4 mb-0">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 hover:bg-soft-brown-100 rounded-lg transition-colors"
                >
                  <Menu size={24} className="text-soft-brown-700" />
                </button>
                <h1 className="text-xl font-semibold text-gray-800">
                  Dashboard Kasir
                </h1>
              </div>
              <div className="flex items-center space-x-3">
                <UserCircle size={28} className="text-soft-brown-600" />
                <span className="text-base font-medium text-gray-700">
                  {userName}
                </span>
              </div>
            </div>
          </header>
          <div className="flex-1 p-6 overflow-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default KasirLayout;
