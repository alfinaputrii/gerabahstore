// src/components/admin/charts/TopProductsChart.jsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const TopProductsChart = ({ data }) => {
  // Format data untuk grafik
  const chartData =
    data?.map((item) => ({
      name:
        item.name.length > 15 ? item.name.substring(0, 15) + "..." : item.name,
      sold: item.total_sold,
    })) || [];

  if (chartData.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        Belum ada data produk terlaris
      </div>
    );
  }

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E6D5B8" />
          <XAxis
            type="number"
            stroke="#6F4E37"
            tick={{ fill: "#6F4E37", fontSize: 12 }}
          />
          <YAxis
            dataKey="name"
            type="category"
            stroke="#6F4E37"
            tick={{ fill: "#6F4E37", fontSize: 12 }}
            width={120}
          />
          <Tooltip
            formatter={(value) => [value + " terjual", "Jumlah"]}
            labelStyle={{ color: "#6F4E37", fontWeight: "bold" }}
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #E6D5B8",
              borderRadius: "8px",
            }}
          />
          <Bar
            dataKey="sold"
            fill="#A67B5B"
            radius={[0, 8, 8, 0]}
            barSize={20}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopProductsChart;
