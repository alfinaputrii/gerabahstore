// src/components/admin/charts/SalesChart.jsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const SalesChart = ({ data }) => {
  // Format data untuk grafik
  const chartData =
    data?.map((item) => ({
      date: new Date(item.date).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
      }),
      total: item.total,
    })) || [];

  // Format rupiah untuk tooltip
  const formatRupiah = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  if (chartData.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        Belum ada data penjualan
      </div>
    );
  }

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E6D5B8" />
          <XAxis
            dataKey="date"
            stroke="#6F4E37"
            tick={{ fill: "#6F4E37", fontSize: 12 }}
          />
          <YAxis
            stroke="#6F4E37"
            tick={{ fill: "#6F4E37", fontSize: 12 }}
            tickFormatter={(value) => formatRupiah(value)}
          />
          <Tooltip
            formatter={(value) => [formatRupiah(value), "Penjualan"]}
            labelStyle={{ color: "#6F4E37", fontWeight: "bold" }}
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #E6D5B8",
              borderRadius: "8px",
            }}
          />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#A67B5B"
            strokeWidth={3}
            dot={{ fill: "#8B5A2B", strokeWidth: 2 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;
