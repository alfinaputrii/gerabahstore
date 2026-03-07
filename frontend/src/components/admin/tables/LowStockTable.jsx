// src/components/admin/tables/LowStockTable.jsx
import { AlertTriangle } from "lucide-react";

const LowStockTable = ({ products }) => {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <AlertTriangle className="mx-auto h-12 w-12 text-gray-400 mb-3" />
        <p>Semua stok aman</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-soft-brown-200">
        <thead>
          <tr className="bg-soft-brown-50">
            <th className="px-6 py-3 text-left text-xs font-medium text-soft-brown-700 uppercase tracking-wider">
              Nama Produk
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-soft-brown-700 uppercase tracking-wider">
              Kategori
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-soft-brown-700 uppercase tracking-wider">
              Stok
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-soft-brown-700 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-soft-brown-200">
          {products.map((product) => (
            <tr
              key={product.id}
              className="hover:bg-soft-brown-50 transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {product.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {product.category || "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                <span
                  className={`font-medium ${product.stock < 3 ? "text-red-600" : "text-yellow-600"}`}
                >
                  {product.stock}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    product.stock < 3
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {product.stock < 3 ? "Segera Restok" : "Menipis"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LowStockTable;
