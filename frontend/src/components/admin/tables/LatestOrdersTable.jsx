// src/components/admin/tables/LatestOrdersTable.jsx
import { Package } from "lucide-react";

const LatestOrdersTable = ({ orders }) => {
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
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Package className="mx-auto h-12 w-12 text-gray-400 mb-3" />
        <p>Belum ada pesanan</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-soft-brown-200">
        <thead>
          <tr className="bg-soft-brown-50">
            <th className="px-6 py-3 text-left text-xs font-medium text-soft-brown-700 uppercase tracking-wider">
              ID Pesanan
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-soft-brown-700 uppercase tracking-wider">
              Pelanggan
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-soft-brown-700 uppercase tracking-wider">
              Total
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-soft-brown-700 uppercase tracking-wider">
              Tanggal
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-soft-brown-200">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-soft-brown-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                #{order.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {order.customer_name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {formatRupiah(order.total_amount)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(order.transaction_date)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LatestOrdersTable;