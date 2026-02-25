// src/layouts/AdminLayout.jsx
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";

const AdminLayout = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
    { icon: Package, label: "Produk", path: "/admin/products" },
    { icon: ShoppingCart, label: "Pesanan", path: "/admin/orders" },
    { icon: Users, label: "Pelanggan", path: "/admin/customers" },
    { icon: Settings, label: "Pengaturan", path: "/admin/settings" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-soft-brown-50 flex">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "w-64" : "w-20"} bg-white shadow-lg transition-all duration-300 flex flex-col border-r border-soft-brown-200`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-soft-brown-200">
          <h1
            className={`font-bold text-soft-brown-700 ${!sidebarOpen && "text-center"}`}
          >
            {sidebarOpen ? "Toko Gerabah" : "TG"}
          </h1>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 py-4">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="w-full flex items-center px-4 py-3 text-gray-600 hover:bg-soft-brown-100 hover:text-soft-brown-700 transition-colors"
            >
              <item.icon size={20} className="text-soft-brown-600" />
              {sidebarOpen && <span className="ml-4">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-soft-brown-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-red-500 hover:bg-red-50 transition-colors rounded-lg"
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="ml-4">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 border-b border-soft-brown-200">
          <div className="flex justify-between items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-soft-brown-100 rounded-lg transition-colors"
            >
              <Menu size={20} className="text-soft-brown-700" />
            </button>
            <div className="flex items-center gap-4">
              <span className="text-sm text-soft-brown-700">Admin</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
