// src/pages/customer/Cart.jsx
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "../../context/CartContext";

export default function Cart() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    getTotalPrice,
    getTotalItems,
  } = useCart();
  const navigate = useNavigate();

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  const formatRupiah = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <ShoppingBag className="w-24 h-24 mx-auto mb-6 text-beige" />
          <h1 className="text-4xl mb-4 text-dark-brown font-serif">
            Keranjang Kosong
          </h1>
          <p className="text-lg text-warm-brown mb-8">
            Yuk, mulai belanja koleksi gerabah kami
          </p>
          <Link
            to="/shop"
            className="inline-block px-8 py-3 bg-terracotta text-white rounded-lg hover:bg-warm-brown transition-all duration-300"
          >
            Mulai Belanja
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl md:text-6xl mb-12 text-dark-brown font-serif">
          Keranjang Belanja
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex gap-6">
                  {/* Product Image */}
                  <Link
                    to={`/product/${item.id}`}
                    className="flex-shrink-0 w-32 h-32 rounded-lg overflow-hidden bg-beige"
                  >
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">
                        🏺
                      </div>
                    )}
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-warm-brown mb-1">
                        {item.category_name || "Produk"}
                      </p>
                      <Link to={`/product/${item.id}`}>
                        <h3 className="text-2xl text-dark-brown hover:text-terracotta transition-colors font-serif">
                          {item.name}
                        </h3>
                      </Link>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-8 h-8 rounded-full bg-beige hover:bg-terracotta hover:text-white transition-colors flex items-center justify-center"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center text-lg text-dark-brown">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-8 h-8 rounded-full bg-beige hover:bg-terracotta hover:text-white transition-colors flex items-center justify-center"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Price and Remove */}
                      <div className="flex items-center gap-6">
                        <p className="text-xl text-terracotta font-medium">
                          {formatRupiah(item.price * item.quantity)}
                        </p>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-warm-brown hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg p-8 shadow-sm sticky top-24">
            <h2 className="text-3xl mb-6 text-dark-brown font-serif">
              Ringkasan Belanja
            </h2>

            <div className="space-y-4 mb-6 pb-6 border-b border-beige">
              <div className="flex justify-between text-warm-brown">
                <span>Total Item</span>
                <span>{totalItems}</span>
              </div>
              <div className="flex justify-between text-warm-brown">
                <span>Subtotal</span>
                <span>{formatRupiah(totalPrice)}</span>
              </div>
            </div>

            <div className="flex justify-between text-2xl mb-8 text-dark-brown">
              <span>Total</span>
              <span className="text-terracotta">
                {formatRupiah(totalPrice)}
              </span>
            </div>

            {/* TOMBOL - LEBAR SAMA & LEBIH LEBAR */}
            <div className="flex flex-col items-center gap-3">
              <button
                onClick={() => navigate("/checkout")}
                className="px-8 py-3 bg-terracotta text-white rounded-lg hover:bg-warm-brown transition-all duration-300"
                style={{ minWidth: "260px" }}
              >
                Lanjut ke Pembayaran
              </button>

              <Link to="/shop">
                <button
                  className="px-8 py-3 border-2 border-terracotta text-terracotta rounded-lg hover:bg-terracotta hover:text-white transition-all duration-300"
                  style={{ minWidth: "260px" }}
                >
                  Lanjut Belanja
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
