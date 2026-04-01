// src/pages/kasir/Riwayat.jsx
import { useState, useEffect } from "react";
import { Search, Calendar, Eye, Loader } from "lucide-react";
import toast from "react-hot-toast";
import { transactionAPI, getUserData } from "../../api/endpoints";

const KasirRiwayat = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const user = getUserData();
  const cashierId = user?.id;

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    if (!cashierId) {
      toast.error("Data kasir tidak ditemukan");
      return;
    }

    try {
      setLoading(true);
      const response = await transactionAPI.getByCashier(cashierId);
      console.log("📥 Riwayat response:", response.data); // Untuk debugging
      
      // PERBAIKAN 1: Ambil dari response.data.data
      setTransactions(response.data.data || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Gagal mengambil riwayat transaksi");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (id) => {
    try {
      const response = await transactionAPI.getById(id);
      console.log("📋 Detail response:", response.data); // Untuk debugging
      
      // PERBAIKAN 2: Ambil dari response.data.data
      setSelectedTransaction(response.data.data);
      setShowDetail(true);
    } catch (error) {
      toast.error("Gagal mengambil detail transaksi");
    }
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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Filter transaksi (PERBAIKAN 3: tambah guest_name)
  const filteredTransactions = transactions.filter(trx => {
    const customerName = trx.customer_name || trx.guest_name || "";
    const matchesSearch = 
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trx.id.toString().includes(searchTerm);
    
    const matchesDate = selectedDate 
      ? new Date(trx.transaction_date).toISOString().split('T')[0] === selectedDate
      : true;
    
    return matchesSearch && matchesDate;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin h-8 w-8 text-soft-brown-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Riwayat Transaksi</h1>

      {/* Filter */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-soft-brown-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cari ID atau nama pelanggan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-soft-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-soft-brown-300"
            />
          </div>

          {/* Filter Tanggal */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-soft-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-soft-brown-300"
            />
          </div>

          {/* Reset */}
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedDate("");
            }}
            className="px-4 py-2 border border-soft-brown-200 rounded-lg hover:bg-gray-50"
          >
            Reset Filter
          </button>
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
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-soft-brown-700 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-soft-brown-700 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-soft-brown-700 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-soft-brown-200">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <p>Tidak ada transaksi</p>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((trx) => (
                  <tr key={trx.id} className="hover:bg-soft-brown-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{trx.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {trx.customer_name || trx.guest_name || "Guest"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatRupiah(trx.total_amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {trx.items?.length || 0} item
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(trx.transaction_date).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleViewDetail(trx.id)}
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
      </div>

      {/* Modal Detail */}
      {showDetail && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-soft-brown-200">
              <h2 className="text-xl font-bold text-soft-brown-800">
                Detail Transaksi #{selectedTransaction.id}
              </h2>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {/* Info */}
              <div className="grid grid-cols-2 gap-4 mb-6 bg-soft-brown-50 p-4 rounded-lg">
                <div>
                  <p className="text-xs text-gray-500">Pelanggan</p>
                  <p className="font-medium">
                    {selectedTransaction.customer_name || selectedTransaction.guest_name || "Guest"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Tanggal</p>
                  <p className="font-medium">{formatDate(selectedTransaction.transaction_date)}</p>
                </div>
              </div>

              {/* Items */}
              <h3 className="font-semibold mb-3">Item</h3>
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
                  {selectedTransaction.items?.map((item, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-2">{item.product_name}</td>
                      <td className="px-4 py-2 text-right">{item.quantity}</td>
                      <td className="px-4 py-2 text-right">{formatRupiah(item.price)}</td>
                      <td className="px-4 py-2 text-right">{formatRupiah(item.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 font-medium">
                  <tr>
                    <td colSpan="3" className="px-4 py-2 text-right">Total</td>
                    <td className="px-4 py-2 text-right">{formatRupiah(selectedTransaction.total_amount)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="p-6 border-t border-soft-brown-200 flex justify-end">
              <button
                onClick={() => {
                  setShowDetail(false);
                  setSelectedTransaction(null);
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

export default KasirRiwayat;