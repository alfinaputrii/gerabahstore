// src/components/layout/Header.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, LogOut, Package } from "lucide-react";
import { useCart } from "../../context/CartContext";

export default function Header() {
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const cartCount = getTotalItems?.() || 0;
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-cream border-b border-beige backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="group">
            <h1 className="text-3xl tracking-wide text-dark-brown transition-colors hover:text-terracotta font-serif">
              Bhumika Rupa
            </h1>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-warm-brown hover:text-terracotta transition-colors"
            >
              Home
            </Link>
            <Link
              to="/shop"
              className="text-warm-brown hover:text-terracotta transition-colors"
            >
              Shop
            </Link>
            <Link
              to="/about"
              className="text-warm-brown hover:text-terracotta transition-colors"
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className="text-warm-brown hover:text-terracotta transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <Link
              to="/cart"
              className="relative group flex items-center gap-2 text-warm-brown hover:text-terracotta transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-terracotta text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-warm-brown hover:text-terracotta transition-colors"
              >
                <User className="w-5 h-5" />
              </button>

              {showProfileMenu && (
                <div className="absolute -left-16 mt-2 w-48 bg-white rounded-lg shadow-lg border border-beige z-50">
                  <Link
                    to="/profile"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-3 px-4 py-3 text-dark-brown hover:bg-cream transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                  <Link
                    to="/my-orders"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-3 px-4 py-3 text-dark-brown hover:bg-cream transition-colors"
                  >
                    <Package className="w-4 h-4" />
                    Pesanan Saya
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="logout-button flex items-center gap-3 px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors border-t border-beige w-full"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
