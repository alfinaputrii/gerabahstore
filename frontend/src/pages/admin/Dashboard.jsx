// src/pages/admin/Dashboard.jsx
import { useState, useEffect } from "react";
import { DollarSign, ShoppingBag, Users, Package } from "lucide-react";
import StatCard from "../../components/admin/StatCard";
import SalesChart from "../../components/admin/charts/SalesChart";
import TopProductsChart from "../../components/admin/charts/TopProductsChart";
import LatestOrdersTable from "../../components/admin/tables/LatestOrdersTable";
import LowStockTable from "../../components/admin/tables/LowStockTable";
import {
  StatCardSkeleton,
  ChartSkeleton,
  TableSkeleton,
} from "../../components/admin/Skeleton"; // <-- IMPORT SKELETON
import {
  getDashboardSummary,
  getDailySales,
  getTopProducts,
  getLatestOrders,
  getLowStock,
} from "../../api/dashboard";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState(null);
  const [dailySales, setDailySales] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [latestOrders, setLatestOrders] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);

      const [summary, sales, products, orders, stock] = await Promise.all([
        getDashboardSummary(),
        getDailySales(7),
        getTopProducts(5),
        getLatestOrders(5),
        getLowStock(5),
      ]);

      setSummaryData(summary.data);
      setDailySales(sales.data || []);
      setTopProducts(products.data || []);
      setLatestOrders(orders.data || []);
      setLowStock(stock.data || []);
    } catch (err) {
      setError("Gagal mengambil data dashboard");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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

  // Tampilkan skeleton kalau loading
  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-soft-brown-800">
          Dashboard Admin
        </h1>

        {/* 4 Stat Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>

        {/* Tables Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TableSkeleton />
          <TableSkeleton />
        </div>
      </div>
    );
  }

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
          value={formatRupiah(summaryData?.summary?.revenue || 0)}
          bgColor="bg-green-100"
        />
        <StatCard
          icon={ShoppingBag}
          title="Total Pesanan"
          value={summaryData?.summary?.orders || 0}
          bgColor="bg-blue-100"
        />
        <StatCard
          icon={Users}
          title="Pelanggan Baru"
          value={summaryData?.summary?.new_customers || 0}
          bgColor="bg-purple-100"
        />
        <StatCard
          icon={Package}
          title="Produk Terjual"
          value={summaryData?.summary?.items_sold || 0}
          bgColor="bg-yellow-100"
        />
      </div>

      {/* Grafik Penjualan & Produk Terlaris */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-soft-brown-200">
          <h2 className="text-lg font-semibold text-soft-brown-700 mb-4">
            📈 Grafik Penjualan 7 Hari Terakhir
          </h2>
          <SalesChart data={dailySales} />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-soft-brown-200">
          <h2 className="text-lg font-semibold text-soft-brown-700 mb-4">
            🏆 5 Produk Terlaris
          </h2>
          <TopProductsChart data={topProducts} />
        </div>
      </div>

      {/* 2 Kolom Tabel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-soft-brown-200">
          <h2 className="text-lg font-semibold text-soft-brown-700 mb-4">
            🛒 5 Pesanan Terbaru
          </h2>
          <LatestOrdersTable orders={latestOrders} />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-soft-brown-200">
          <h2 className="text-lg font-semibold text-soft-brown-700 mb-4">
            ⚠️ Stok Hampir Habis
          </h2>
          <LowStockTable products={lowStock} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
