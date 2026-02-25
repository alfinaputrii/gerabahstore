// src/pages/admin/Dashboard.jsx
import { useState, useEffect } from "react";
import { DollarSign, ShoppingBag, Users, Package } from "lucide-react";
import StatCard from "../../components/admin/StatCard";
import { getDashboardSummary } from "../../api/dashboard";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const result = await getDashboardSummary();
      console.log("Dashboard data:", result);
      setData(result.data);
    } catch (err) {
      setError("Gagal mengambil data dashboard");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-soft-brown-700"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  const formatRupiah = (num) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-soft-brown-800">
        Dashboard Admin
      </h1>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={DollarSign}
          title="Pendapatan Bulan Ini"
          value={formatRupiah(data?.summary?.revenue || 0)}
          bgColor="bg-green-100"
        />
        <StatCard
          icon={ShoppingBag}
          title="Total Pesanan"
          value={data?.summary?.orders || 0}
          bgColor="bg-blue-100"
        />
        <StatCard
          icon={Users}
          title="Pelanggan Baru"
          value={data?.summary?.new_customers || 0}
          bgColor="bg-purple-100"
        />
        <StatCard
          icon={Package}
          title="Produk Terjual"
          value={data?.summary?.items_sold || 0}
          bgColor="bg-yellow-100"
        />
      </div>

      {/* Coming Soon Section */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-soft-brown-200 text-center">
        <h2 className="text-xl font-semibold text-soft-brown-700 mb-3">
          ✨ Grafik Penjualan & Produk Terlaris
        </h2>
        <p className="text-soft-brown-500">
          Fitur grafik akan segera hadir di update berikutnya
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
