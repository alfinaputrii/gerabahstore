// src/components/layout/Header.jsx
import { Link } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '../../context/CartContext'

export default function Header() {
  const { getTotalItems } = useCart()
  const cartCount = getTotalItems?.() || 0
CartContext.jsx;
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
          </div>

          {/* Cart Icon */}
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
        </div>
      </div>
    </nav>
  )
}