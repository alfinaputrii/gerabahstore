// src/pages/admin/orders/Orders.jsx
import { useState, useEffect } from "react";
import { Search, Eye, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../../api/axios";
import { TableSkeleton } from "../../../components/admin/Skeleton";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [dateFilter, setDateFilter] = useState({
    startDate: "",
    endDate: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  useEffect(() => {
    fetchOrders();
  }, [pagination.page]);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };

      if (dateFilter.startDate) params.startDate = dateFilter.startDate;
      if (dateFilter.endDate) params.endDate = dateFilter.endDate;
      if (searchTerm) params.search = searchTerm;

      const response = await api.get("/transactions", { params });

      setOrders(response.data.data || []);
      setPagination(
        response.data.pagination || {
          page: 1,
          limit: 10,
          total: response.data.length,
          totalPages: 1,
        },
      );
    } catch (error) {
      toast.error("Gagal mengambil data pesanan");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchOrders();
  };

  const handleViewDetail = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const formatRupiah = (num) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);
  };

  const formatShortDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatLongDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading && orders.length === 0) {
  return (
    <div className="space-y-6">
      <div className="h-8 bg-soft-brown-100 rounded w-48 animate-pulse"></div>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-soft-brown-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 bg-soft-brown-100 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
      <TableSkeleton rows={5} columns={8} />
    </div>
  );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-soft-brown-800">
          Kelola Pesanan
        </h1>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-soft-brown-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Cari ID atau nama pelanggan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pl-10 pr-4 py-2 border border-soft-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-soft-brown-300"
            />
          </div>

          {/* Date Filter */}
          <div className="relative">
            <Calendar
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="date"
              value={dateFilter.startDate}
              onChange={(e) =>
                setDateFilter({ ...dateFilter, startDate: e.target.value })
              }
              className="w-full pl-10 pr-3 py-2 border border-soft-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-soft-brown-300"
            />
          </div>

          <div className="relative">
            <Calendar
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="date"
              value={dateFilter.endDate}
              onChange={(e) =>
                setDateFilter({ ...dateFilter, endDate: e.target.value })
              }
              className="w-full pl-10 pr-3 py-2 border border-soft-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-soft-brown-300"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleSearch}
              className="flex-1 px-4 py-2 bg-soft-brown-600 text-white rounded-lg hover:bg-soft-brown-700"
            >
              Terapkan Filter
            </button>
            <button
              onClick={() => {
                setDateFilter({ startDate: "", endDate: "" });
                setSearchTerm("");
                setPagination((prev) => ({ ...prev, page: 1 }));
                setTimeout(() => fetchOrders(), 100);
              }}
              className="px-4 py-2 border border-soft-brown-200 rounded-lg hover:bg-gray-50"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-soft-brown-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-soft-brown-200">
            <thead className="bg-soft-brown-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-soft-brown-700 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-soft-brown-700 uppercase tracking-wider">
                  Pelanggan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-soft-brown-700 uppercase tracking-wider">
                  Kasir
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-soft-brown-700 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-soft-brown-700 uppercase tracking-wider">
                  Dibayar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-soft-brown-700 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-soft-brown-700 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-soft-brown-700 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-soft-brown-200">
              {orders.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <p>Tidak ada data pesanan</p>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-soft-brown-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {order.customer_name || "Guest"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {order.cashier_name || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatRupiah(order.total_amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatRupiah(order.paid)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatShortDate(order.transaction_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <span className="bg-soft-brown-100 text-soft-brown-700 px-2 py-1 rounded-full text-xs">
                        {order.items?.length || 0} item
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleViewDetail(order)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="Lihat Detail"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-soft-brown-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Menampilkan {(pagination.page - 1) * pagination.limit + 1} -{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
              dari {pagination.total} data
            </div>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                }
                disabled={pagination.page === 1}
                className="p-2 border border-soft-brown-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="px-4 py-2 border border-soft-brown-200 rounded-lg bg-soft-brown-50">
                Halaman {pagination.page} / {pagination.totalPages}
              </span>
              <button
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                }
                disabled={pagination.page >= pagination.totalPages}
                className="p-2 border border-soft-brown-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-soft-brown-200">
              <h2 className="text-xl font-bold text-soft-brown-800">
                Detail Pesanan #{selectedOrder.id}
              </h2>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {/* Info Customer */}
              <div className="grid grid-cols-2 gap-4 mb-6 bg-soft-brown-50 p-4 rounded-lg">
                <div>
                  <p className="text-xs text-gray-500">Pelanggan</p>
                  <p className="font-medium">
                    {selectedOrder.customer_name || "Guest"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Kasir</p>
                  <p className="font-medium">
                    {selectedOrder.cashier_name || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Tanggal</p>
                  <p className="font-medium">
                    {formatLongDate(selectedOrder.transaction_date)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Diskon</p>
                  <p className="font-medium">
                    {selectedOrder.discount_applied
                      ? `${selectedOrder.discount_applied * 100}%`
                      : "0%"}
                  </p>
                </div>
              </div>

              {/* Items */}
              <h3 className="font-semibold mb-3">Item Pesanan</h3>
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Produk</th>
                    <th className="px-4 py-2 text-right">Jumlah</th>
                    <th className="px-4 py-2 text-right">Harga</th>
                    <th className="px-4 py-2 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {selectedOrder.items?.map((item, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-2">{item.product_name}</td>
                      <td className="px-4 py-2 text-right">{item.quantity}</td>
                      <td className="px-4 py-2 text-right">
                        {formatRupiah(item.price)}
                      </td>
                      <td className="px-4 py-2 text-right">
                        {formatRupiah(item.subtotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>

                {/* Footer dengan perhitungan diskon DESIMAL (0.1 = 10%) */}
                <tfoot className="bg-gray-50 font-medium">
                  {(() => {
                    // Hitung diskon - discount_applied dalam DESIMAL (0.1 = 10%)
                    const diskonDesimal = selectedOrder.discount_applied || 0;
                    const diskonPersen = diskonDesimal * 100; // 0.1 * 100 = 10%
                    const diskonRupiah =
                      selectedOrder.total_amount * diskonDesimal; // LANGSUNG KALI DESIMAL
                    const totalSetelahDiskon =
                      selectedOrder.total_amount - diskonRupiah;
                    const kembalian = selectedOrder.paid - totalSetelahDiskon;

                    return (
                      <>
                        <tr>
                          <td colSpan="3" className="px-4 py-2 text-right">
                            Subtotal
                          </td>
                          <td className="px-4 py-2 text-right">
                            {formatRupiah(selectedOrder.total_amount)}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan="3" className="px-4 py-2 text-right">
                            Diskon ({diskonPersen}%)
                          </td>
                          <td className="px-4 py-2 text-right text-green-600">
                            - {formatRupiah(diskonRupiah)}
                          </td>
                        </tr>
                        <tr>
                          <td
                            colSpan="3"
                            className="px-4 py-2 text-right font-bold"
                          >
                            Total Setelah Diskon
                          </td>
                          <td className="px-4 py-2 text-right font-bold">
                            {formatRupiah(totalSetelahDiskon)}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan="3" className="px-4 py-2 text-right">
                            Dibayar
                          </td>
                          <td className="px-4 py-2 text-right">
                            {formatRupiah(selectedOrder.paid)}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan="3" className="px-4 py-2 text-right">
                            Kembali
                          </td>
                          <td className="px-4 py-2 text-right">
                            {Math.abs(kembalian) < 1
                              ? "✓ Lunas"
                              : kembalian > 0
                                ? formatRupiah(kembalian)
                                : `Kurang ${formatRupiah(Math.abs(kembalian))}`}
                          </td>
                        </tr>
                      </>
                    );
                  })()}
                </tfoot>
              </table>
            </div>

            <div className="p-6 border-t border-soft-brown-200 flex justify-end">
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedOrder(null);
                }}
                className="px-6 py-2 bg-soft-brown-600 text-white rounded-lg hover:bg-soft-brown-700"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
