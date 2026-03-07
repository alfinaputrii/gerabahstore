// src/components/admin/Skeleton.jsx

// Skeleton untuk stat card (dashboard)
export const StatCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-soft-brown-200">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-soft-brown-100 rounded-lg animate-pulse"></div>
      </div>
      <div className="h-4 bg-soft-brown-100 rounded w-3/4 mb-2 animate-pulse"></div>
      <div className="h-8 bg-soft-brown-100 rounded w-1/2 animate-pulse"></div>
    </div>
  );
};

// Skeleton untuk chart
export const ChartSkeleton = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-soft-brown-200">
      <div className="h-6 bg-soft-brown-100 rounded w-48 mb-4 animate-pulse"></div>
      <div className="h-64 bg-soft-brown-100 rounded animate-pulse"></div>
    </div>
  );
};

// Skeleton untuk tabel produk (khusus)
export const ProductTableSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-soft-brown-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-soft-brown-200">
          <thead className="bg-soft-brown-50">
            <tr>
              {[...Array(6)].map((_, i) => (
                <th key={i} className="px-6 py-3">
                  <div className="h-4 bg-soft-brown-200 rounded w-20 animate-pulse"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-soft-brown-200">
            {[...Array(5)].map((_, rowIndex) => (
              <tr key={rowIndex}>
                {[...Array(6)].map((_, colIndex) => (
                  <td key={colIndex} className="px-6 py-4">
                    <div className="h-4 bg-soft-brown-100 rounded w-full animate-pulse"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Skeleton untuk tabel (baris per baris) - FLEKSIBEL
export const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-soft-brown-200 overflow-hidden">
      <div className="bg-soft-brown-50 p-4">
        <div className="h-4 bg-soft-brown-200 rounded w-32 animate-pulse"></div>
      </div>
      <div className="p-4 space-y-3">
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="flex gap-4">
            {[...Array(columns)].map((_, j) => (
              <div key={j} className="h-8 bg-soft-brown-100 rounded w-full animate-pulse"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// Skeleton untuk grid card (kategori)
export const GridSkeleton = ({ items = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(items)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl shadow-sm border border-soft-brown-200 p-4">
          <div className="h-5 bg-soft-brown-100 rounded w-3/4 mb-2 animate-pulse"></div>
          <div className="h-4 bg-soft-brown-100 rounded w-full mb-2 animate-pulse"></div>
          <div className="h-4 bg-soft-brown-100 rounded w-2/3 animate-pulse"></div>
        </div>
      ))}
    </div>
  );
};

// Skeleton untuk form settings
export const FormSkeleton = () => {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i}>
          <div className="h-4 bg-soft-brown-100 rounded w-24 mb-1 animate-pulse"></div>
          <div className="h-10 bg-soft-brown-100 rounded w-full animate-pulse"></div>
        </div>
      ))}
    </div>
  );
};