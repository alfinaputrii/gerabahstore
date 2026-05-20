// src/pages/customer/MyOrders.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Package, Calendar, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { getUserData } from "../../api/endpoints";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = getUserData();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/users/${user?.id}/transactions?limit=10`,
      );
      setOrders(response.data.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    // Sesuaikan dengan status dari database
    return "bg-yellow-100 text-yellow-800";
  };

  const formatRupiah = (num) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-terracotta"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-6 lg:px-8 bg-cream">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl mb-12 text-dark-brown font-serif">
            Pesanan Saya
          </h1>

          {orders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <Package className="w-24 h-24 mx-auto mb-6 text-beige" />
              <h2 className="text-2xl mb-4 text-dark-brown font-serif">
                Belum Ada Pesanan
              </h2>
              <p className="text-warm-brown mb-8">
                Mulai belanja untuk melihat pesanan Anda di sini
              </p>
              <Link to="/shop">
                <button className="px-6 py-3 bg-terracotta text-white rounded-lg hover:bg-warm-brown">
                  Mulai Belanja
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order, index) => (
                <motion.div
                  key={order.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="p-6 bg-cream border-b border-beige">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <Package className="w-6 h-6 text-terracotta" />
                        <div>
                          <h3 className="text-xl text-dark-brown font-serif">
                            #{order.id}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar className="w-4 h-4 text-warm-brown" />
                            <p className="text-sm text-warm-brown">
                              {formatDate(order.transaction_date)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span
                          className={`px-4 py-2 rounded-full text-sm ${getStatusColor(
                            order.status,
                          )}`}
                        >
                          {order.status || "Diproses"}
                        </span>
                        <p className="text-2xl text-terracotta font-serif">
                          {formatRupiah(order.total_amount)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="space-y-4 mb-6">
                      {order.items?.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className="flex justify-between items-center text-warm-brown"
                        >
                          <span>
                            {item.product_name} × {item.quantity}
                          </span>
                          <span>{formatRupiah(item.subtotal)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-cream rounded-lg">
                      <MapPin className="w-5 h-5 text-terracotta mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-warm-brown mb-1">
                          Alamat Pengiriman
                        </p>
                        <p className="text-dark-brown">
                          {order.shipping_address || "Alamat tidak tersedia"}
                          {order.shipping_city && `, ${order.shipping_city}`}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
