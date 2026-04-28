// src/pages/customer/Checkout.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useCart } from "../../context/CartContext";
import api from "../../api/axios";

export default function Checkout() {
  const { items, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    notes: "",
  });

  const totalPrice = getTotalPrice();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const formatRupiah = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.address
    ) {
      toast.error("Lengkapi data pengiriman");
      return;
    }

    if (items.length === 0) {
      toast.error("Keranjang kosong");
      navigate("/cart");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Memproses pesanan...");

    try {
      // Siapkan data transaksi
      const transactionData = {
        customer_id: user.id || 1, // Guest default ID 1
        cashier_id: 1, // Default cashier
        products: items.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
        guest_name: !user.id ? formData.fullName : null,
      };

      // Kirim ke backend
      const response = await api.post("/transactions", transactionData);

      toast.dismiss(loadingToast);
      toast.success("Pesanan berhasil dibuat!");

      // Simpan detail order untuk halaman konfirmasi
      const orderDetails = {
        orderNumber: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        customer: formData,
        items: items,
        totalPrice: totalPrice,
        transaction: response.data.data,
        date: new Date().toISOString(),
      };

      // Hapus keranjang
      clearCart();

      // Redirect ke halaman konfirmasi
      navigate("/order-confirmation", { state: { orderDetails } });
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("Checkout error:", error);
      toast.error(error.response?.data?.message || "Gagal memproses pesanan");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="min-h-screen py-12 px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl md:text-6xl mb-12 text-dark-brown font-serif">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg p-8 shadow-sm"
            >
              <h2 className="text-3xl mb-8 text-dark-brown font-serif">
                Informasi Pengiriman
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-dark-brown mb-2">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-cream border border-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta text-dark-brown"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-dark-brown mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-cream border border-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta text-dark-brown"
                    />
                  </div>

                  <div>
                    <label className="block text-dark-brown mb-2">
                      No. Telepon *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-cream border border-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta text-dark-brown"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-dark-brown mb-2">Alamat *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-cream border border-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta text-dark-brown"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-dark-brown mb-2">Kota *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-cream border border-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta text-dark-brown"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-dark-brown mb-2">
                    Catatan (opsional)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 bg-cream border border-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta text-dark-brown"
                    placeholder="Contoh: Pakai bubble wrap, dll"
                  />
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-beige">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-terracotta text-white rounded-lg hover:bg-warm-brown transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? "Memproses..." : "Buat Pesanan"}
                </button>
              </div>
            </motion.form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-8 shadow-sm sticky top-24">
              <h2 className="text-3xl mb-6 text-dark-brown font-serif">
                Ringkasan Pesanan
              </h2>

              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-warm-brown"
                  >
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>{formatRupiah(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6 pb-6 border-b border-beige">
                <div className="flex justify-between text-warm-brown">
                  <span>Subtotal</span>
                  <span>{formatRupiah(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-warm-brown">
                  <span>Pengiriman</span>
                  <span>Gratis</span>
                </div>
              </div>

              <div className="flex justify-between text-2xl text-dark-brown">
                <span>Total</span>
                <span className="text-terracotta">
                  {formatRupiah(totalPrice)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
