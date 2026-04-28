// src/pages/customer/OrderConfirmation.jsx
import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderDetails = location.state?.orderDetails;

  useEffect(() => {
    if (!orderDetails) {
      navigate("/");
    }
  }, [orderDetails, navigate]);

  if (!orderDetails) {
    return null;
  }

  const formatRupiah = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen py-12 px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <CheckCircle className="w-24 h-24 mx-auto mb-6 text-green-600" />
          </motion.div>
          <h1 className="text-5xl md:text-6xl mb-4 text-dark-brown font-serif">
            Pesanan Berhasil!
          </h1>
          <p className="text-xl text-warm-brown">
            Terima kasih telah berbelanja di Bhumika Rupa
          </p>
        </motion.div>

        <motion.div
          className="bg-white rounded-lg p-8 shadow-sm mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="mb-8 pb-8 border-b border-beige">
            <h2 className="text-2xl mb-4 text-dark-brown font-serif">Detail Pesanan</h2>
            <p className="text-warm-brown">
              Nomor Pesanan: <span className="text-terracotta font-medium">{orderDetails.orderNumber}</span>
            </p>
            <p className="text-warm-brown mt-2">
              Tanggal: <span className="text-dark-brown">{formatDate(orderDetails.date)}</span>
            </p>
            {orderDetails.transaction?.id && (
              <p className="text-warm-brown mt-2">
              ID Transaksi: <span className="text-dark-brown">#{orderDetails.transaction.id}</span>
              </p>
            )}
          </div>

          <div className="mb-8 pb-8 border-b border-beige">
            <h2 className="text-2xl mb-4 text-dark-brown font-serif">Informasi Pengiriman</h2>
            <div className="text-warm-brown space-y-1">
              <p>{orderDetails.customer.fullName}</p>
              <p>{orderDetails.customer.email}</p>
              <p>{orderDetails.customer.phone}</p>
              <p>{orderDetails.customer.address}</p>
              <p>{orderDetails.customer.city}</p>
              {orderDetails.customer.notes && (
                <p className="mt-2 text-sm italic">Catatan: {orderDetails.customer.notes}</p>
              )}
            </div>
          </div>

          <div className="mb-8 pb-8 border-b border-beige">
            <h2 className="text-2xl mb-4 text-dark-brown font-serif">Item Pesanan</h2>
            <div className="space-y-4">
              {orderDetails.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-beige">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                          🏺
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-dark-brown">{item.name}</p>
                      <p className="text-sm text-warm-brown">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="text-terracotta">
                    {formatRupiah(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center text-2xl text-dark-brown">
            <span>Total Pembayaran</span>
            <span className="text-terracotta text-3xl font-serif">
              {formatRupiah(orderDetails.totalPrice)}
            </span>
          </div>
        </motion.div>

        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p className="text-warm-brown mb-6">
            Kami akan mengirimkan konfirmasi pengiriman ke email Anda.
          </p>
          <Link to="/shop">
            <button className="px-8 py-3 bg-terracotta text-white rounded-lg hover:bg-warm-brown transition-all duration-300">
              Lanjut Belanja
            </button>
          </Link>
          <Link to="/" className="block">
            <button className="px-8 py-3 border-2 border-terracotta text-terracotta rounded-lg hover:bg-terracotta hover:text-white transition-all duration-300">
              Kembali ke Beranda
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}